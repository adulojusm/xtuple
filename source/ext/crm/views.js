/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  var panels = [
    {name: "stateList", kind: "XV.StateList"},
    {name: "countryList", kind: "XV.CountryList"},
    {name: "priorityList", kind: "XV.PriorityList"},
    {name: "honorificList", kind: "XV.HonorificList"},
    {name: "incidentCategoryList", kind: "XV.IncidentCategoryList"},
    {name: "incidentResoulutionList", kind: "XV.IncidentResolutionList"},
    {name: "incidentSeverityList", kind: "XV.IncidentSeverityList"},
    {name: "opportunitySourceList", kind: "XV.OpportunitySourceList"},
    {name: "opportunityStageList", kind: "XV.OpportunityStageList"},
    {name: "opportunityTypeList", kind: "XV.OpportunityTypeList"}
  ];
  
  XV.Postbooks.appendPanels("setup", panels);

  var module = {
    name: "crm",
    label: "_crm".loc(),
    panels: [
      {name: "accountList", kind: "XV.AccountList"},
      {name: "contactList", kind: "XV.ContactList"},
      {name: "toDoList", kind: "XV.ToDoList"},
      {name: "opportunityList", kind: "XV.OpportunityList"},
      {name: "incidentList", kind: "XV.IncidentList"},
      {name: "projectList", kind: "XV.ProjectList"}
    ]
  };

  XV.Postbooks.insertModule(module, 1);

}());
