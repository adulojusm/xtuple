/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict:false*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true */

(function () {

  XT.extensions.project.initPickers = function () {

    // ..........................................................
    // PROJECT EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.ProjectEmailProfilePicker",
      kind: "XV.PickerWidget",
      label: "_emailProfile".loc(),
      collection: "XM.projectEmailProfiles"
    });

    // ..........................................................
    // PROJECT STATUS
    //

    enyo.kind({
      name: "XV.ProjectStatusPicker",
      kind: "XV.PickerWidget",
      collection: "XM.projectStatuses",
      showNone: false
    });


    // ..........................................................
    // PROJECT TYPE
    //

    enyo.kind({
      name: "XV.ProjectTypePicker",
      kind: "XV.PickerWidget",
      collection: "XM.projectTypes",
      nameAttribute: "code"
    });

    // ..........................................................
    // RESOURCE
    // TODO: use picker instead

    enyo.kind({
      name: "XV.ResourcePicker",
      kind: "XV.PickerWidget",
      collection: "XM.resources",
      showNone: false,
      nameAttribute: "code"
    });

  };

}());
