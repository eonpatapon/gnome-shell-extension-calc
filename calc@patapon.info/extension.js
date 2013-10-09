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
        this.appInfo = this.app.get_app_info();
    },

    getInitialResultSet: function(terms) {
        let expr = terms.join('').replace(/,/g, '.');
        if (/^[0-9.+*/()-]+$/.test(expr)) {
            try {
                let result = eval(expr).toString();
                this.searchSystem.setResults(this, [{'id': 0,
                                                     'name': expr,
                                                     'description': result,
                                                     'createIcon': function() {return false;}}]);
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

    activateResult: function(resultId) {
        this.app.open_new_window(-1);
    },

    launchSearch: function(terms) {
        this.app.open_new_window(-1);
    }
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
