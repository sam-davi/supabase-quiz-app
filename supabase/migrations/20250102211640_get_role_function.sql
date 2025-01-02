create function get_role_from_team(team_slug text)
returns text
language plpgsql
as $$
declare v_role text;
begin
    select 
        role 
    into 
        v_role 
    from 
        members 
    inner join 
        profiles 
    on 
        members.member = profiles.slug
    where 
        team = team_slug 
        and profiles.user_id = (select auth.uid());
    
    if v_role is null then
        return 'none';
    end if;
    return v_role;
end;
$$