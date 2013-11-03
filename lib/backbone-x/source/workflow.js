/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    An abstract class for handling workflow models.

    @extends XM.Model
  */
  XM.Workflow = XM.Model.extend({
    /** @scope XM.Workflow.prototype */


    defaults: function () {
      return {
        owner: XM.currentUser,
        assignedTo: XM.currentUser,
        status: XM.Workflow.PENDING,
        priority: XT.session.settings.get("DefaultPriority"),
        sequence: 0
      };
    },

    // ..........................................................
    // METHODS
    //

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('change:completeDate', this.completeDateDidChange);
      this.on('change:status', this.workflowStatusDidChange);
    },

    completeDateDidChange: function (model, value, options) {
      var completeDate = this.get("completeDate"),
        K = XM.Workflow;

      // If complete date set, mark completed
      if (completeDate) {
        this.set("status", K.COMPLETED);
      }
    },

    /**
    Returns workflow status as a localized string.

    @returns {String}
    */
    getWorkflowStatusString: function () {
      var K = XM.Workflow,
        status = this.get('status');

      switch (status)
      {
      case K.PENDING:
        return '_pending'.loc();
      case K.IN_PROCESS:
        return '_inProcess'.loc();
      case K.COMPLETED:
        return '_completed'.loc();
      case K.DEFERRED:
        return '_deferred'.loc();
      }
    },

    isActive: function () {
      var status = this.get("status"),
        K = XM.Workflow;
      return status === K.PENDING || status === K.IN_PROCESS;
    },

    workflowStatusDidChange: function (model, value, options) {
      var status = this.get("status"),
        K = XM.Workflow,
        parent,
        parentStatus,
        workflow,
        successors;

      if (status === K.IN_PROCESS) {
        if (!this.get("startDate")) {
          this.set("startDate", XT.date.today());
        }

      // If marked completed
      } else if (status === K.COMPLETED) {

        // Update complete date if applicable
        if (!this.get("completeDate")) {
          this.set("completeDate", XT.date.today());
        }

        // Update parent status if applicable
        parent = this.get("parent");
        parentStatus = this.get("completedParentStatus");
        if (parentStatus) {
          parent.set("status", parentStatus);
        }

        // Update successor statuses if applicable
        workflow = parent.get("workflow");
        successors = (this.get("completedSuccessors") || "").split(",");
        _.each(successors, function (successor) {
          var item = workflow.get(successor),
            status = item.get("status");

          if (status === K.PENDING) {
            item.set("status", K.IN_PROCESS);
          }
        });
      } else if (status === K.DEFERRED) {

        // Update parent status if applicable
        parent = this.get("parent");
        parentStatus = this.get("deferredParentStatus");
        if (parentStatus) {
          parent.set("status", parentStatus);
        }

        // Update successor statuses if applicable
        workflow = parent.get("workflow");
        successors = (this.get("deferredSuccessors") || "").split(",");
        _.each(successors, function (successor) {
          var item = workflow.get(successor),
            status = item.get("status");

          if (status === K.PENDING) {
            item.set("status", K.IN_PROCESS);
          }
        });
      }
    }

  });

  // Workflow status mixin
  XM.Workflow = XM.Workflow.extend(XM.WorkflowStatus);

  _.extend(XM.Workflow, {
     /** @scope XM.Workflow */

    /**
      Pending status for workflow.

      @static
      @constant
      @type String
      @default P
    */
    PENDING: 'P',

    /**
      Deffered status for workflow.

      @static
      @constant
      @type String
      @default D
    */
    DEFERRED: 'D',

    /**
      In-progress status for workflow.
      @static
      @constant
      @type String
      @default I
    */
    IN_PROCESS: 'I',

    /**
      Completed status for workflow.
      @static
      @constant
      @type String
      @default C
    */
    COMPLETED: 'C'

  });

  /**
    @class

    An abstract class for handling workflow templates.

    @extends XM.Model
  */
  XM.WorkflowSource = XM.Model.extend(
    /** @scope XM.WorkflowSource.prototype */ {

    defaults: function () {
      return {
        startSet: false,
        startOffset: 0,
        dueSet: false,
        dueOffset: 0,
        priority: XT.session.settings.get("DefaultPriority"),
        sequence: 0
      };
    },

    readOnlyAttributes: [
      "dueOffset",
      "startOffset"
    ],

    // ..........................................................
    // METHODS
    //

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('change:dueSet', this.dueSetDidChange);
      this.on('change:startSet', this.startSetDidChange);
      this.on('statusChange', this.statusDidChange);
    },

    dueSetDidChange: function () {
      this.setReadOnly("dueOffset", !this.get("dueSet"));
    },

    statusDidChange: function () {
      if (this.getStatus() === XM.Model.READY_CLEAN) {
        this.dueSetDidChange();
        this.startSetDidChange();
      }
    },

    startSetDidChange: function () {
      this.setReadOnly("startOffset", !this.get("startSet"));
    }

  });

}());
