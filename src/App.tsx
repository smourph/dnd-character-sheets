import React, { useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch, useLocation, withRouter } from 'react-router-dom';
import { DnDCharacterProfileSheet, DnDCharacterSpellSheet, DnDCharacterStatsSheet } from 'dnd-character-sheets';
import { characterService } from './service/CharacterService';
import CustomDnDCharacter from './service/CharacterService.type';

import 'dnd-character-sheets/dist/index.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function concatStringsWithSeparator(strings: Array<string | undefined>, separator: string = ' '): string {
  return strings.filter(Boolean).join(separator);
}

const App = (props: any) => {
  const [importedCharacters, setImportedCharacters] = useState<CustomDnDCharacter[]>([]);
  const [character, setCharacter] = useState<CustomDnDCharacter>(getDefaultCharacter());
  const [navTop, setNavTop] = useState<number>(0);
  const [prevScrollPos, setPrevScrollPos] = useState<number>(window.scrollY);

  const [loading, setLoading] = useState<boolean>(false);

  const statsSheet = (
    <DnDCharacterStatsSheet
      character={character}
      onCharacterChanged={updateCharacter}
    />
  );
  const profileSheet = (
    <DnDCharacterProfileSheet
      character={character}
      onCharacterChanged={updateCharacter}
    />
  );
  const spellSheet = (
    <DnDCharacterSpellSheet
      character={character}
      onCharacterChanged={updateCharacter}
    />
  );

  function getDefaultCharacter() {
    let character_: CustomDnDCharacter = {};
    const lsData = localStorage.getItem('dnd-character-data');
    if (lsData) {
      try {
        character_ = JSON.parse(lsData);
      } catch {
      }
    }
    return character_;
  }

  function updateCharacter(character_: CustomDnDCharacter) {
    setCharacter(character_);
    saveCharacterInCache(character_);
  }

  function clearCharacter() {
    setCharacter({});
    saveCharacterInCache({});
  }

  function saveCharacterInCache(character_: CustomDnDCharacter) {
    localStorage.setItem('dnd-character-data', JSON.stringify(character_));
  }

  function loadCharacterFromJson(json: string) {
    try {
      const result = JSON.parse(json);
      if (!Array.isArray(result) && typeof result === 'object') {
        updateCharacter(result);
      } else {
        window.alert('Json file does not contain a DnD character.');
      }
    } catch {
      window.alert('Json file does not contain a DnD character.');
    }
  }

  function loadCharacterFromDatabase(event: React.ChangeEvent<HTMLSelectElement>) {
    const id = event.target.value;
    if (id && id !== '') {
      const foundCharacter = importedCharacters.find(importedCharacter => importedCharacter.id === id);
      if (foundCharacter) {
        updateCharacter(foundCharacter);
      }
    }
  }

  function importCharacterFromFile(event: any) {
    if (event.target.files.length > 0) {
      const fr = new FileReader();

      fr.onload = function (e) {
        if (e.target && e.target.result && typeof e.target.result === 'string') {
          loadCharacterFromJson(e.target.result);
        }
      };

      fr.readAsText(event.target.files[0]);
      event.target.value = '';
    }
  }

  const importCharactersFromDatabase = () => {
    setLoading(true);
    characterService.findAll()
      .then(response => {
        if (!Array.isArray(response)) {
          throw new Error('Database does not contain DnD characters.');
        }

        const characters = response.map(element => {
          const char = element.data;
          char.id = element.path;
          return char;
        });
        setImportedCharacters(characters);

        if (character?.id && character.id !== '') {
          const foundCharacter = characters.find(character_ => character_.id === character.id);
          if (foundCharacter) {
            updateCharacter(foundCharacter);
          }
        }
      })
      .catch(error => {
        console.log('Failed to load all character names.');
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  function saveCharacterInDatabase() {
    setLoading(true);
    characterService.add(character)
      .then(id => {
        character.id = id;
        updateCharacter(character);
      })
      .catch(error => {
        console.log('Failed to save character in database');
        console.log(error);
      })
      .finally(() => setLoading(false));
  }

  function exportCharacterIntoFile() {
    const json = JSON.stringify(character, null, 2);

    const a = document.createElement('a');
    const file = new Blob([json], { type: 'application/json' });
    a.href = URL.createObjectURL(file);
    a.download = character.name ? character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.json' : 'dnd-character.json';
    a.click();
  }

  function getDefaultRedirect() {
    let defaultRedirect = '/all';
    if (window.innerWidth < 992) {
      // is mobile device
      defaultRedirect = '/stats';
    }
    return defaultRedirect;
  }

  window.onscroll = function () {onScroll();};

  function onScroll() {
    const currentScrollPos = window.scrollY;
    if (prevScrollPos > currentScrollPos || currentScrollPos < 20) {
      setNavTop(0);
    } else {
      setNavTop(-280);
    }
    setPrevScrollPos(currentScrollPos);
  }

  return (
    <div>
      <nav className="no-print navbar navbar-expand-lg navbar-dark fixed-top"
        style={{ backgroundColor: 'rgb(0,0,0)', top: navTop === 0 ? '' : navTop + 'px' }}>
        <button className="navbar-toggler" type="button" data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div style={{ width: '100%' }}>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-lg-5" data-toggle="collapse" data-target=".navbar-collapse.show">
              <li className="nav-item mr-lg-3">
                <Link className={props.location.pathname === '/all' ? 'nav-link active' : 'nav-link'}
                  to="/all">All</Link>
              </li>
              <li className="nav-item mr-lg-3">
                <Link className={props.location.pathname === '/stats' ? 'nav-link active' : 'nav-link'}
                  to="/stats">Stats</Link>
              </li>
              <li className="nav-item mr-lg-3">
                <Link className={props.location.pathname === '/profile' ? 'nav-link active' : 'nav-link'}
                  to="/profile">Profile</Link>
              </li>
              <li className="nav-item mr-lg-3">
                <Link className={props.location.pathname === '/spells' ? 'nav-link active' : 'nav-link'}
                  to="/spells">Spells</Link>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto mr-lg-5" data-toggle="collapse" data-target=".navbar-collapse.show">
              <li className="nav-item mr-lg-3">
                <button disabled={loading} className="btn btn-success" onClick={() => clearCharacter()}>
                  Create a new sheet
                </button>
                <input disabled={loading} style={{ display: 'none' }} type="file" id="selectFiles"
                  accept="application/json" onChange={(e) => importCharacterFromFile(e)} />
                <button disabled={loading} className="btn btn-primary"
                  onClick={() => document.getElementById("selectFiles")?.click()}>
                  Import
                </button>
                <button disabled={loading} className="btn btn-primary" onClick={() => exportCharacterIntoFile()}>
                  Export
                </button>
                <button disabled={loading} className="btn btn-primary" onClick={() => importCharactersFromDatabase()}>
                  {importedCharacters.length > 0 ? 'Refresh database' : 'Import sheets from online database'}
                </button>
                {importedCharacters.length > 0 &&
                  <select onChange={(event: React.ChangeEvent<HTMLSelectElement>) => loadCharacterFromDatabase(event)}
                    value={character?.id || ''}>
                    <option value="">Select character from database</option>
                    {importedCharacters.map(importedCharacter => {
                      const element = character?.id === importedCharacter.id ? character : importedCharacter;
                      return (
                        <option key={element.id} value={element.id}>
                          {concatStringsWithSeparator([
                            element.name,
                            concatStringsWithSeparator([element.race, element.classLevel])
                          ], ' | ')}
                        </option>);
                    })}
                  </select>
                }
                <button disabled={loading} className="btn btn-primary" onClick={() => saveCharacterInDatabase()}>
                  Save sheet in database
                </button>
                <button disabled={loading} className="btn btn-light" onClick={() => window.print()}>
                  Print
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="app-holder">

        {loading &&
          <div className="overlay">
            <div className="popup-spinner">
              <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border text-dark" role="status"
                  style={{ width: '4rem', height: '4rem', zIndex: 20 }}>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        }

        <Switch>
          <Route exact path="/">
            <ScrollToTop />
            <Redirect to={getDefaultRedirect()} />
          </Route>
          <Route exact path="/all">
            <ScrollToTop />
            {statsSheet}
            <div className="page-break" />
            <div className="page-space" />
            {profileSheet}
            <div className="page-break" />
            <div className="page-space" />
            {spellSheet}
          </Route>
          <Route exact path="/stats">
            <ScrollToTop />
            {statsSheet}
          </Route>
          <Route exact path="/profile">
            <ScrollToTop />
            {profileSheet}
          </Route>
          <Route exact path="/spells">
            <ScrollToTop />
            {spellSheet}
          </Route>
        </Switch>

      </div>
      <footer className="no-print page-footer font-small text-white pt-4"
        style={{ backgroundColor: 'rgb(0,0,0)' }}>
        <div className="container-fluid container-xl text-center text-md-left mt-2 mb-3">
          <div className="row">
            <div className="col-md-6 mt-md-0 mt-3">
              <h5>DnD Character Sheets</h5>
              <p>This page was created using dnd-character-sheets, an open source ReactJs library created by Daryl
                Buckle.</p>
            </div>
            <hr className="clearfix w-100 d-md-none pb-3" />
            <div className="col-md-3 mb-md-0 mb-3">
              <h5>Links</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="https://github.com/darylbuckle/dnd-character-sheets">Source Code</a>
                </li>
                <li>
                  <a href="https://www.npmjs.com/package/dnd-character-sheets">Npm</a>
                </li>
                <li>
                  <a href="https://github.com/darylbuckle">Daryl Buckle</a>
                </li>
              </ul>
            </div>
            <div className="col-md-3 mb-md-0 mb-3">
              <h5>Related</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="https://darylbuckle.github.io/espergen-character-sheets">Esper Genesis Character Sheets</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright text-center mt-5 py-2 text-white small"
          style={{ backgroundColor: 'rgb(0,0,0)' }}>
          MIT © Daryl Buckle 2020
        </div>
      </footer>
    </div>

  );
};

export default withRouter(App);
