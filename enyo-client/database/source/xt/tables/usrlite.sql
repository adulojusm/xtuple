select xt.create_table('usrlite');

select xt.add_column('usrlite','usr_username', 'text', 'primary key');
select xt.add_column('usrlite','usr_propername', 'text');
select xt.add_column('usrlite','usr_active', 'boolean');
select xt.add_column('usrlite','usr_disable_export', 'boolean');
select xt.add_column('usrlite','usr_email', 'text');
select xt.add_column('usrlite','obj_uuid', 'text', 'default xt.generate_uuid()', 'xt');
select xt.add_inheritance('usrlite', 'xt.obj');
select xt.add_constraint('usrlite', 'usrlite_obj_uui_id','unique(obj_uuid)', 'xt');

comment on table xt.usrlite is 'A light weight table of user information used to avoid punishingly heavy queries on the public usr view';

insert into xt.usrlite select 
  usr_username, 
  usr_propername,
  usr_active,
  usr_disable_export,
  usr_email
from xt.usrinfo u
where u.usr_username not in (
  select usr_username
  from xt.usrlite);
