/**
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
**/

const St = imports.gi.St;
const Shell = imports.gi.Shell;
const GLib = imports.gi.GLib;
const Main = imports.ui.main;
const Lang = imports.lang;

let calcProvider = "";

const CalcProvider = new Lang.Class({
    Name: 'CalcProvider',

    _init: function() {
        this.id = "calculator";
        this.app = Shell.AppSystem.get_default().lookup_app('gcalctool.desktop');
    },

    getInitialResultSet: function(terms) {
        let expr = terms.join('').replace(/,/g, '.');
        if (/^[0-9.+*/()-]+$/.test(expr)) {
            try {
                let result = eval(expr).toString();
                this.searchSystem.setResults(this, [{'id': 0,
                                                     'name': result,
                                                     'description': result,
                                                     'createIcon': function(size) {
                                                       return new St.Icon({icon_size: size,
                                                                           icon_name: 'accessories-calculator'});
                                                     }}]);
            }
            catch(exp) {
                this.searchSystem.setResults(this, []);
            }
        }
        else {
            this.searchSystem.setResults(this, []);
        }
    },

    getSubsearchResultSet: function(prevResults, terms) {
        return this.getInitialResultSet(terms);
    },

    getResultMetas: function(result, callback) {
        callback(result);
    },

    filterResults: function(results, max) {
        return results;
    },

    activateResult: function(resultId) {
        if (this.app)
          this.app.open_new_window(-1);
    },

    launchSearch: function(terms) {
        if (this.app)
          this.app.open_new_window(-1);
    },

    createResultObject: function(resultMeta, terms) {
        return null;
    },
});

function init() {
    calcProvider = new CalcProvider();
}

function enable() {
    Main.overview.addSearchProvider(calcProvider);
}

function disable() {
    Main.overview.removeSearchProvider(calcProvider);
}
