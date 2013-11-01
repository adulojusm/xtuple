/** 
  This view returns all activity types that are part of the core system.
  Note,however, results will not be returned unless table type mappings have been
  inserted into the xt.acttype table which is usually done by an extension
  that employes one or more of these activities.
*/

select xt.create_view('xt.act', $$

-- TODO
select 
  obj_uuid as act_uuid,
  acttype_code as act_type,
  todoitem_name as act_name,
  todoitem_active as act_active,
  todoitem_status as act_status,
  todoitem_priority_id as act_priority_id,
  todoitem_description as act_description,
  todoitem_owner_username as act_owner_username,
  todoitem_username as act_assigned_username,
  todoitem_start_date as act_start_date,
  todoitem_due_date as act_due_date,
  todoitem_assigned_date as act_assigned_date,
  todoitem_completed_date as act_completed_date,
  null as act_parent_uuid
from todoitem
  join pg_class c on todoitem.tableoid = c.oid
  join xt.acttype on acttype_tblname=relname

-- OPPORTUNITY
union all
select 
  ophead.obj_uuid as act_uuid,
  acttype_code as act_type,
  ophead_number as act_number,
  ophead_active as act_active,
  opstage_name as act_status,
  ophead_priority_id as act_priority_id,
  ophead_name as act_description,
  ophead_owner_username as act_owner_username,
  ophead_username as act_assigned_username,
  ophead_start_date as act_start_date,
  ophead_target_date as act_due_date,
  ophead_assigned_date as act_assigned_date,
  ophead_actual_date as act_completed_date,
  null as act_parent_uuid
from ophead
  join opstage on opstage_id=ophead_opstage_id
  join pg_class c on ophead.tableoid = c.oid
  join xt.acttype on acttype_tblname=relname

-- INCIDENT

union all
select 
  incdt.obj_uuid as act_uuid,
  acttype_code as act_type,
  incdt_number::text as act_number,
  incdt_status != 'L' as act_active,
  incdt_status as act_status,
  incdt_incdtpriority_id as act_priority_id,
  incdt_summary as act_description,
  incdt_owner_username as act_owner_username,
  incdt_assigned_username as act_assigned_username,
  incdt_timestamp::date as act_start_date,
  null as act_due_date,
  null as act_assigned_date,
  null as act_completed_date,
  null as act_parent_uuid
from incdt
  join pg_class c on incdt.tableoid = c.oid
  join xt.acttype on acttype_tblname=relname

-- PROJECT
union all
select 
  obj_uuid as act_uuid,
  acttype_code as act_type,
  prj_number as act_name,
  prj_status != 'C' as act_active,
  prj_status as act_status,
  prjext_priority_id as act_priority_id,
  prj_name as act_description,
  prj_owner_username as act_owner_username,
  prj_username as act_assigned_username,
  prj_start_date as act_start_date,
  prj_due_date as act_due_date,
  prj_assigned_date as act_assigned_date,
  prj_completed_date as act_completed_date,
  null as act_parent_uuid
from prj
  join xt.prjext on prj_id=prjext_id
  join pg_class c on prj.tableoid = c.oid
  join xt.acttype on acttype_tblname=relname

-- PROJECT TASK
union all
select 
  prjtask.obj_uuid as act_uuid,
  acttype_code as act_type,
  prjtask_number as act_name,
  prjtask_status != 'C' as act_active,
  prjtask_status as act_status,
  prjtaskext_priority_id as act_priority_id,
  prjtask_name as act_description,
  prjtask_owner_username as act_owner_username,
  prjtask_username as act_assigned_username,
  prjtask_start_date as act_start_date,
  prjtask_due_date as act_due_date,
  prjtask_assigned_date as act_assigned_date,
  prjtask_completed_date as act_completed_date,
  prj.obj_uuid as act_parent_uuid
from prjtask
  join xt.prjtaskext on prjtaskext_id=prjtask_id
  join prj on prj_id=prjtask_prj_id
  join pg_class c on prjtask.tableoid = c.oid
  join xt.acttype on acttype_tblname=relname

-- PROJECT WORKFLOW

union all
select 
  wf.obj_uuid as act_uuid,
  acttype_code as act_type,
  wf_name as act_name,
  wf_status not in ('C','D') as act_active,
  wf_status as act_status,
  wf_priority_id as act_priority_id,
  wf_description as act_description,
  wf_owner_username as act_owner_username,
  wf_assigned_username as act_assigned_username,
  wf_start_date as act_start_date,
  wf_due_date as act_due_date,
  wf_assigned_date as act_assigned_date,
  wf_completed_date as act_completed_date,
  prj.obj_uuid as act_parent_uuid
from xt.prjwf wf
  join prj on prj_id=wf_parent_id
  join pg_class c on wf.tableoid = c.oid
  join xt.acttype on acttype_tblname=relname;

$$, true);

-- remove old trigger if any
--drop trigger if exists actinfo_did_change on xt.usrinfo;

-- create trigger
--create trigger usr_did_change instead of insert or update or delete on xt.actinfo
--  for each row execute procedure xt.actinfo_did_change();



