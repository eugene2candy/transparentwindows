const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

function init() {
}

const TransparentWindowsMyWidget = new GObject.Class({
    Name: 'TransparentWindows.Prefs.TransparentWindowsSettingsWidget',
    GTypeName: 'TransparentWindowsSettingsWidget',
    Extends: Gtk.Grid,

    _init: function(params) {
        this.parent(params);
            this.margin = 27;
            this.row_spacing = 5;
            this.column_spacing = 2;
  
        this._settings = Convenience.getSettings();
        this.mainBox = new Gtk.Grid({ row_spacing: 1, column_spacing: 15, margin_right:180,  });
        this.attach(new Gtk.Label({ label: '[TODO: This text is missing. Hope it was not important.]', halign: Gtk.Align.START }), 0, 0, 1, 1);
        this._entry = new Gtk.Entry({ hexpand: true });
        this.attach(new Gtk.Label({ label: 'Terminal window title (hit enter to confirm):', halign: Gtk.Align.START }), 0, 5, 1, 1);
        this._entry.placeholder_text = this._settings.get_string('terminal-title');
        this._entry.connect('activate', Lang.bind(this, this._hitEnter));
        this.attach(this._entry, 0, 6, 1, 1);
        this._hide = new Gtk.CheckButton({label: 'Hide panel indicator', active: this._settings.get_int('showinpanel'),});
        this._hide.connect('toggled', Lang.bind(this, this._hideChanged));
        this.attach(this._hide, 0, 1, 1, 1);
        this._aoppacity = new Gtk.CheckButton({label: 'Auto apply opacity to terminals', active: this._settings.get_int('autoterminal'),});
        this._aoppacity.connect('toggled', Lang.bind(this, this._autoChanged));
        this.attach(this._aoppacity, 0, 2, 1, 1);
        this._tonly = new Gtk.CheckButton({label: 'Aply opacity to terminals only', active: this._settings.get_int('onlyterminal'),});
        this._tonly.connect('toggled', Lang.bind(this, this._tonlyChanged));
        this.attach(this._tonly, 0, 3, 1, 1);
		//add global opacity slider     
        this.mainBox.attach(new Gtk.Label({ label: 'Global opacity', halign: Gtk.Align.START }), 0, 2, 1, 1);
        this.hscale = Gtk.Scale.new_with_range(Gtk.Orientation.HORIZONTAL, 50, 255, 1);
        this.hscale.set_value(this._settings.get_int('opacity'));
        this.hscale.set_digits(0);
        this.hscale.set_hexpand(true);
        this.hscale.connect('value-changed', Lang.bind(this, this._opacityChanged));
        this.mainBox.attach(this.hscale, 1, 2, 1, 1);
        //add terminal opacity slider
        this.mainBox.attach(new Gtk.Label({ label: 'Terminal windows opacity', halign: Gtk.Align.START }), 0, 3, 1, 1);
        this.termScale = Gtk.Scale.new_with_range(Gtk.Orientation.HORIZONTAL, 50, 255, 1);
        this.termScale.set_value(this._settings.get_int('terminalopacity'));
        this.termScale.set_digits(0);
        this.termScale.set_hexpand(true);
        this.termScale.connect('value-changed', Lang.bind(this, this._topacityChanged));
        this.mainBox.attach(this.termScale, 1, 3, 1, 1);
      	this.attach(this.mainBox, 0, 4, 1, 1);
    },
	
	_hideChanged: function() {
		if (this._settings.get_int('showinpanel') > 0) {
			this._settings.set_int('showinpanel', 0);
		} else {
			this._settings.set_int('showinpanel', 1);
		}
	},
	
	_tonlyChanged: function() {
		if (this._settings.get_int('onlyterminal') > 0) {
			this._settings.set_int('onlyterminal', 0);
		} else {
			this._settings.set_int('onlyterminal', 1);
		}
	},
	
	_autoChanged: function() {
		if (this._settings.get_int('autoterminal') > 0) {
			this._settings.set_int('autoterminal', 0);
		} else {
			this._settings.set_int('autoterminal', 1);
		}
	},
	
    _hitEnter: function () {
        this._settings.set_string('terminal-title', this._entry.text);
        this._entry.editable = false;
        this._entry.has_frame = false;
    },
    
    _opacityChanged: function () {
        this._settings.set_int('opacity', this.hscale.get_value());
    },
    
    _topacityChanged: function () {
        this._settings.set_int('terminalopacity', this.termScale.get_value());
    },
});

function buildPrefsWidget() {
    let widget = new TransparentWindowsMyWidget();
    widget.show_all();

    return widget;
}
