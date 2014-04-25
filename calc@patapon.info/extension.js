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
        this.app = Shell.AppSystem.get_default().lookup_app('gnome-calculator.desktop');
    },

    _do: function(callback, result) {
        if (typeof callback === "function") {
            callback(result);
        }
    },

    _search: function(terms, callback) {
        let expr = terms.join('').replace(/,/g, '.');
        let items = [];
        if (/^[0-9.+*/()-]+$/.test(expr)) {
            try {
                let result = eval(expr).toString();
                items = [result];
            }
            catch(exp) {}
        }
        this._do(callback, items);
    },

    getInitialResultSet: function(terms, callback) {
        this._search(terms, callback);
    },

    getSubsearchResultSet: function(prevResults, terms, callback) {
        this._search(terms, callback);
    },

    getResultMetas: function(result, callback) {
        callback([{
                    'id': 0,
                    'name': result[0],
                    'description': result[0],
                    'createIcon': function(size) {
                        return new St.Icon({icon_size: size,
                                          icon_name: 'accessories-calculator'});
                    }
                }]);
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
    if(typeof Main.overview.viewSelector === "object" &&
       typeof Main.overview.viewSelector._searchResults === "object" &&
       typeof Main.overview.viewSelector._searchResults._searchSystem === "object" &&
       typeof Main.overview.viewSelector._searchResults._searchSystem.addProvider === "function") {
        Main.overview.viewSelector._searchResults._searchSystem.addProvider(calcProvider);
    }
}

function disable() {
}
