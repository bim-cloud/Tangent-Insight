-- ============================================================================
-- people_directory.sql  —  GENERATED from autodesk_id__list.csv (91 people)
-- RUN ONCE in the Supabase SQL Editor (idempotent: safe to re-run).
--
-- id / username = email local-part (the per-human key). In Microsoft 365 /
-- Entra / AD this normally equals the Windows sign-in name, so the agent's
-- windows_user resolves on `username` even when an Autodesk ID is shared
-- (e.g. pooled bimuserN accounts). email is kept as the last-resort key.
-- Any person whose Windows login differs will surface as unresolved in
-- agent_machines after rollout — see the reconciliation query at the bottom.
-- ============================================================================

insert into public.people (id, name, initials, role, discipline, dept, username, email) values
  ('abhilash.kumar', 'Abhilash Kumar', 'AK', 'Staff', 'UNASSIGNED', 'Unassigned', 'abhilash.kumar', 'abhilash.kumar@tangentlandscape.com'),
  ('abhilash.rajesh', 'Abhilash Rajesh', 'AR', 'Staff', 'UNASSIGNED', 'Unassigned', 'abhilash.rajesh', 'abhilash.rajesh@tangentlandscape.com'),
  ('abhilash.sudhakaran', 'Abhilash Sudhakaran', 'AS', 'Staff', 'UNASSIGNED', 'Unassigned', 'abhilash.sudhakaran', 'abhilash.sudhakaran@tangentlandscape.com'),
  ('adhithyan.biju', 'Adhithyan Biju', 'AB', 'Staff', 'UNASSIGNED', 'Unassigned', 'adhithyan.biju', 'adhithyan.biju@tangentlandscape.com'),
  ('afsal.badharu', 'Afsal Badharu', 'AB', 'Staff', 'UNASSIGNED', 'Unassigned', 'afsal.badharu', 'afsal.badharu@tangentlandscape.com'),
  ('ajay.krishnan', 'Ajay Krishnan', 'AK', 'Staff', 'UNASSIGNED', 'Unassigned', 'ajay.krishnan', 'ajay.krishnan@tangentlandscape.com'),
  ('akash.gopalakrishnan', 'Akash Gopalakrishnan', 'AG', 'Staff', 'UNASSIGNED', 'Unassigned', 'akash.gopalakrishnan', 'akash.gopalakrishnan@tangentlandscape.com'),
  ('akshaya.jayakrishnan', 'Akshaya Jayakrishnan', 'AJ', 'Staff', 'UNASSIGNED', 'Unassigned', 'akshaya.jayakrishnan', 'akshaya.jayakrishnan@tangentlandscape.com'),
  ('ameeksha', 'Ameeksha Tangent', 'AT', 'Staff', 'UNASSIGNED', 'Unassigned', 'ameeksha', 'ameeksha@tangentlandscape.com'),
  ('amna.salim', 'Amna Salim', 'AS', 'Staff', 'UNASSIGNED', 'Unassigned', 'amna.salim', 'amna.salim@tangentlandscape.com'),
  ('amrita.kumari', 'Amrita Kumari', 'AK', 'Staff', 'UNASSIGNED', 'Unassigned', 'amrita.kumari', 'amrita.kumari@tangentlandscape.com'),
  ('ananthu.unnikrishnan', 'Ananthu Unnikrishnan', 'AU', 'Staff', 'UNASSIGNED', 'Unassigned', 'ananthu.unnikrishnan', 'ananthu.unnikrishnan@tangentlandscape.com'),
  ('anisha.varghese', 'Anisha Varghese', 'AV', 'Staff', 'UNASSIGNED', 'Unassigned', 'anisha.varghese', 'anisha.varghese@tangentlandscape.com'),
  ('anjali.tla', 'Anjali Tla', 'AT', 'Staff', 'UNASSIGNED', 'Unassigned', 'anjali.tla', 'anjali.tla@tangentlandscape.com'),
  ('anshu.jalaludeen', 'Anshu Jalaludeen', 'AJ', 'Staff', 'UNASSIGNED', 'Unassigned', 'anshu.jalaludeen', 'anshu.jalaludeen@tangentlandscape.com'),
  ('aparna.lakshmi', 'Aparna Lakshmi', 'AL', 'Staff', 'UNASSIGNED', 'Unassigned', 'aparna.lakshmi', 'aparna.lakshmi@tangentlandscape.com'),
  ('arun.pranav', 'Arun Pranav', 'AP', 'Staff', 'UNASSIGNED', 'Unassigned', 'arun.pranav', 'arun.pranav@tangentlandscape.com'),
  ('hudha.shirin', 'Arvindh Murugaiyan', 'AM', 'Staff', 'UNASSIGNED', 'Unassigned', 'hudha.shirin', 'hudha.shirin@tangentlandscape.com'),
  ('arya.vijayan', 'Arya Vijayan', 'AV', 'Staff', 'UNASSIGNED', 'Unassigned', 'arya.vijayan', 'arya.vijayan@tangentlandscape.com'),
  ('asela.saranga', 'Asela Saranga', 'AS', 'Staff', 'UNASSIGNED', 'Unassigned', 'asela.saranga', 'asela.saranga@tangentlandscape.com'),
  ('aswathi.vc', 'Aswathi Vc', 'AV', 'Staff', 'UNASSIGNED', 'Unassigned', 'aswathi.vc', 'aswathi.vc@tangentlandscape.com'),
  ('athira.sivdas', 'Athira Sivdas', 'AS', 'Staff', 'UNASSIGNED', 'Unassigned', 'athira.sivdas', 'athira.sivdas@tangentlandscape.com'),
  ('ben.cyrus', 'Ben Cyrus', 'BC', 'Staff', 'UNASSIGNED', 'Unassigned', 'ben.cyrus', 'ben.cyrus@tangentlandscape.com'),
  ('bimuser16', 'Bim User', 'BU', 'Staff', 'UNASSIGNED', 'Unassigned', 'bimuser16', 'bimuser16@marsconsultancy.com'),
  ('bimuser6', 'Bim User', 'BU', 'Staff', 'UNASSIGNED', 'Unassigned', 'bimuser6', 'bimuser6@marsconsultancy.com'),
  ('dileep.kumar', 'Dileep Kumar', 'DK', 'Staff', 'UNASSIGNED', 'Unassigned', 'dileep.kumar', 'dileep.kumar@tangentlandscape.com'),
  ('doc.control', 'Doc Control', 'DC', 'Staff', 'UNASSIGNED', 'Unassigned', 'doc.control', 'doc.control@tangentlandscape.com'),
  ('elbin.paulose', 'Elbin Paulose', 'EP', 'Staff', 'UNASSIGNED', 'Unassigned', 'elbin.paulose', 'elbin.paulose@tangentlandscape.com'),
  ('farsana.firoz', 'Farsana Firoz', 'FF', 'Staff', 'UNASSIGNED', 'Unassigned', 'farsana.firoz', 'farsana.firoz@tangentlandscape.com'),
  ('gurnav.anand', 'Gurnav Anand', 'GA', 'Staff', 'UNASSIGNED', 'Unassigned', 'gurnav.anand', 'gurnav.anand@tangentlandscape.com'),
  ('muhammed.hashik', 'Hashik Haize', 'HH', 'Staff', 'UNASSIGNED', 'Unassigned', 'muhammed.hashik', 'muhammed.hashik@tangentlandscape.com'),
  ('hezaj.roomi', 'Hezaj Roomi', 'HR', 'Staff', 'UNASSIGNED', 'Unassigned', 'hezaj.roomi', 'hezaj.roomi@tangentlandscape.com'),
  ('ilayaraja.santhakumar', 'Ilayaraja Santhakumar', 'IS', 'Staff', 'UNASSIGNED', 'Unassigned', 'ilayaraja.santhakumar', 'ilayaraja.santhakumar@tangentlandscape.com'),
  ('jayati.tla', 'Jayati Tla', 'JT', 'Staff', 'UNASSIGNED', 'Unassigned', 'jayati.tla', 'jayati.tla@tangentlandscape.com'),
  ('jesto.joy', 'Jesto Joy', 'JJ', 'Staff', 'UNASSIGNED', 'Unassigned', 'jesto.joy', 'jesto.joy@tangentlandscape.com'),
  ('jibin.issac', 'Jibin Issac', 'JI', 'Staff', 'UNASSIGNED', 'Unassigned', 'jibin.issac', 'jibin.issac@tangentlandscape.com'),
  ('jincy.nelson', 'Jincy Nelson', 'JN', 'Staff', 'UNASSIGNED', 'Unassigned', 'jincy.nelson', 'jincy.nelson@tangentlandscape.com'),
  ('jithin.baburaj', 'Jithin Baburaj', 'JB', 'Staff', 'UNASSIGNED', 'Unassigned', 'jithin.baburaj', 'jithin.baburaj@tangentlandscape.com'),
  ('jithin.pavithran', 'Jithin Pavithran', 'JP', 'Staff', 'UNASSIGNED', 'Unassigned', 'jithin.pavithran', 'jithin.pavithran@tangentlandscape.com'),
  ('jovanie.apa', 'Jovanie Apa', 'JA', 'Staff', 'UNASSIGNED', 'Unassigned', 'jovanie.apa', 'jovanie.apa@tangentlandscape.com'),
  ('kathija.sheik', 'Kathija Sheik', 'KS', 'Staff', 'UNASSIGNED', 'Unassigned', 'kathija.sheik', 'kathija.sheik@tangentlandscape.com'),
  ('kavitha.melath', 'Kavitha Melath', 'KM', 'Staff', 'UNASSIGNED', 'Unassigned', 'kavitha.melath', 'kavitha.melath@tangentlandscape.com'),
  ('khedr.ahmed', 'Khedr Ahmed', 'KA', 'Staff', 'UNASSIGNED', 'Unassigned', 'khedr.ahmed', 'khedr.ahmed@tangentlandscape.com'),
  ('laura.cruz', 'Laura Cruz', 'LC', 'Staff', 'UNASSIGNED', 'Unassigned', 'laura.cruz', 'laura.cruz@tangentlandscape.com'),
  ('lincy.kirubaharan', 'Lincy Kirubaharan', 'LK', 'Staff', 'UNASSIGNED', 'Unassigned', 'lincy.kirubaharan', 'lincy.kirubaharan@tangentlandscape.com'),
  ('maznaz.firoz', 'Maznaz Firoz', 'MF', 'Staff', 'UNASSIGNED', 'Unassigned', 'maznaz.firoz', 'maznaz.firoz@tangentlandscape.com'),
  ('min.zaw', 'Min Zaw', 'MZ', 'Staff', 'UNASSIGNED', 'Unassigned', 'min.zaw', 'min.zaw@tangentlandscape.com'),
  ('mohamed.asif', 'Mohamed Asif', 'MA', 'Staff', 'UNASSIGNED', 'Unassigned', 'mohamed.asif', 'mohamed.asif@tangentlandscape.com'),
  ('mohammed.rameeskhan', 'Mohammed Rameeskhan', 'MR', 'Staff', 'UNASSIGNED', 'Unassigned', 'mohammed.rameeskhan', 'mohammed.rameeskhan@tangentlandscape.com'),
  ('mohit.das', 'Mohit Das', 'MD', 'Staff', 'UNASSIGNED', 'Unassigned', 'mohit.das', 'mohit.das@tangentlandscape.com'),
  ('mohitnayar3', 'Mohit Nayar', 'MN', 'Staff', 'UNASSIGNED', 'Unassigned', 'mohitnayar3', 'mohitnayar3@gmail.com'),
  ('muhsina.basheer', 'Muhsina Mohammed Basheer', 'MM', 'Staff', 'UNASSIGNED', 'Unassigned', 'muhsina.basheer', 'muhsina.basheer@tangentlandscape.com'),
  ('narsha.abdura', 'Narsha Abdura', 'NA', 'Staff', 'UNASSIGNED', 'Unassigned', 'narsha.abdura', 'narsha.abdura@tangentlandscape.com'),
  ('natasha.nair', 'Natasha Nair', 'NN', 'Staff', 'UNASSIGNED', 'Unassigned', 'natasha.nair', 'natasha.nair@tangentlandscape.com'),
  ('divya.menon', 'New Member', 'NM', 'Staff', 'UNASSIGNED', 'Unassigned', 'divya.menon', 'divya.menon@tangentlandscape.com'),
  ('nikilsha.k', 'Nikilsha K', 'NK', 'Staff', 'UNASSIGNED', 'Unassigned', 'nikilsha.k', 'nikilsha.k@tangentlandscape.com'),
  ('noufal.palliparambil', 'Noufal Palliparambil', 'NP', 'Staff', 'UNASSIGNED', 'Unassigned', 'noufal.palliparambil', 'noufal.palliparambil@tangentlandscape.com'),
  ('parvathy.shajan', 'Parvathy Shajan', 'PS', 'Staff', 'UNASSIGNED', 'Unassigned', 'parvathy.shajan', 'parvathy.shajan@tangentlandscape.com'),
  ('prasanna.kumar', 'Prasanna Kumar', 'PK', 'Staff', 'UNASSIGNED', 'Unassigned', 'prasanna.kumar', 'prasanna.kumar@tangentlandscape.com'),
  ('prince.elvin', 'Prince Elvin', 'PE', 'Staff', 'UNASSIGNED', 'Unassigned', 'prince.elvin', 'prince.elvin@tangentlandscape.com'),
  ('rahul.jain', 'Rahul Jain', 'RJ', 'Staff', 'UNASSIGNED', 'Unassigned', 'rahul.jain', 'rahul.jain@tangentlandscape.com'),
  ('rajul.jain', 'Rahul Jain', 'RJ', 'Staff', 'UNASSIGNED', 'Unassigned', 'rajul.jain', 'rajul.jain@tangentlandscape.com'),
  ('rajeev', 'Rajeev Veedu', 'RV', 'Staff', 'UNASSIGNED', 'Unassigned', 'rajeev', 'rajeev@tangentlandscape.com'),
  ('rameesmohammed.khan', 'Ramees Mohammed', 'RM', 'Staff', 'UNASSIGNED', 'Unassigned', 'rameesmohammed.khan', 'rameesmohammed.khan@gmail.com'),
  ('ramki.kannan', 'Ramki K', 'RK', 'Staff', 'UNASSIGNED', 'Unassigned', 'ramki.kannan', 'ramki.kannan@tangentlandscape.com'),
  ('rashid.abdullah', 'Rashid Abdullah', 'RA', 'Staff', 'UNASSIGNED', 'Unassigned', 'rashid.abdullah', 'rashid.abdullah@tangentlandscape.com'),
  ('renjith.kumar', 'Renjith Kumar', 'RK', 'Staff', 'UNASSIGNED', 'Unassigned', 'renjith.kumar', 'renjith.kumar@tangentlandscape.com'),
  ('resmi.valiyapazhangatty', 'Resmi Pradeep', 'RP', 'Staff', 'UNASSIGNED', 'Unassigned', 'resmi.valiyapazhangatty', 'resmi.valiyapazhangatty@tangentlandscape.com'),
  ('rima.kalihari', 'Rima Kalihari', 'RK', 'Staff', 'UNASSIGNED', 'Unassigned', 'rima.kalihari', 'rima.kalihari@tangentlandscape.com'),
  ('rivin.wilson', 'Rivin Wilson', 'RW', 'Staff', 'UNASSIGNED', 'Unassigned', 'rivin.wilson', 'rivin.wilson@tangentlandscape.com'),
  ('sabarish.malayath', 'Sabarish Malayath', 'SM', 'Staff', 'UNASSIGNED', 'Unassigned', 'sabarish.malayath', 'sabarish.malayath@tangentlandscape.com'),
  ('safas.umar', 'Safas Umar', 'SU', 'Staff', 'UNASSIGNED', 'Unassigned', 'safas.umar', 'safas.umar@tangentlandscape.com'),
  ('saheef.ibrahim', 'Saheef Ibrahim', 'SI', 'Staff', 'UNASSIGNED', 'Unassigned', 'saheef.ibrahim', 'saheef.ibrahim@tangentlandscape.com'),
  ('saluka.lakshith', 'Saluka Lakshith', 'SL', 'Staff', 'UNASSIGNED', 'Unassigned', 'saluka.lakshith', 'saluka.lakshith@tangentlandscape.com'),
  ('sanal.koduvayalil', 'Sanal Koduvayalil', 'SK', 'Staff', 'UNASSIGNED', 'Unassigned', 'sanal.koduvayalil', 'sanal.koduvayalil@tangentlandscape.com'),
  ('seon.varghese', 'Seon Varghese', 'SV', 'Staff', 'UNASSIGNED', 'Unassigned', 'seon.varghese', 'seon.varghese@tangentlandscape.com'),
  ('shalakha.upendran', 'Shalakha Upendran', 'SU', 'Staff', 'UNASSIGNED', 'Unassigned', 'shalakha.upendran', 'shalakha.upendran@tangentlandscape.com'),
  ('shasti.dharan', 'Shastidharan Ohnu', 'SO', 'Staff', 'UNASSIGNED', 'Unassigned', 'shasti.dharan', 'shasti.dharan@tangentlandscape.com'),
  ('sibinesh.rajendran', 'Sibinesh Rajendran', 'SR', 'Staff', 'UNASSIGNED', 'Unassigned', 'sibinesh.rajendran', 'sibinesh.rajendran@tangentlandscape.com'),
  ('soumya.valsala', 'Soumya Valsala', 'SV', 'Staff', 'UNASSIGNED', 'Unassigned', 'soumya.valsala', 'soumya.valsala@tangentlandscape.com'),
  ('sreelekshmi.selvaraj', 'Sreelekshmi Selvaraj', 'SS', 'Staff', 'UNASSIGNED', 'Unassigned', 'sreelekshmi.selvaraj', 'sreelekshmi.selvaraj@tangentlandscape.com'),
  ('sundar.nagarajan', 'Sundara Seelan', 'SS', 'Staff', 'UNASSIGNED', 'Unassigned', 'sundar.nagarajan', 'sundar.nagarajan@tangentlandscape.com'),
  ('syed.tahir', 'Syed Tahir', 'ST', 'Staff', 'UNASSIGNED', 'Unassigned', 'syed.tahir', 'syed.tahir@tangentlandscape.com'),
  ('info', 'Tangent Landscape', 'TL', 'Staff', 'UNASSIGNED', 'Unassigned', 'info', 'info@tangentlandscape.com'),
  ('tasnim.gowshaar', 'Tasnim Gowshaar', 'TG', 'Staff', 'UNASSIGNED', 'Unassigned', 'tasnim.gowshaar', 'tasnim.gowshaar@tangentlandscape.com'),
  ('toby.jose', 'Toby Jose', 'TJ', 'Staff', 'UNASSIGNED', 'Unassigned', 'toby.jose', 'toby.jose@tangentlandscape.com'),
  ('vipin.kalathil', 'Vipin Kalathil', 'VK', 'Staff', 'UNASSIGNED', 'Unassigned', 'vipin.kalathil', 'vipin.kalathil@tangentlandscape.com'),
  ('vishnu.parambil', 'Vishnu Parambil', 'VP', 'Staff', 'UNASSIGNED', 'Unassigned', 'vishnu.parambil', 'vishnu.parambil@tangentlandscape.com'),
  ('vishnupriya.shylaja', 'Vishnupriya Shylaja', 'VS', 'Staff', 'UNASSIGNED', 'Unassigned', 'vishnupriya.shylaja', 'vishnupriya.shylaja@tangentlandscape.com'),
  ('vivek.kattayath', 'Vivek Kattayath', 'VK', 'Staff', 'UNASSIGNED', 'Unassigned', 'vivek.kattayath', 'vivek.kattayath@tangentlandscape.com'),
  ('vyshnavi.surabathula', 'Vyshnavi Surabathula', 'VS', 'Staff', 'UNASSIGNED', 'Unassigned', 'vyshnavi.surabathula', 'vyshnavi.surabathula@tangentlandscape.com')
on conflict (id) do update set
  name=excluded.name, initials=excluded.initials,
  username=excluded.username, email=excluded.email;

-- --- OPTIONAL: remove the 16 fake sample people from the seed -------------
-- The 0003 seed inserted demo staff (u01..u16) + demo submissions/meetings/
-- attendance/activity referencing them. Run this block ONLY if you want a
-- clean roster of just real staff (FK-safe order):
--
--   delete from public.activity_events where user_id   like 'u__';
--   delete from public.attendance      where person_id like 'u__';
--   delete from public.submissions     where submitted_by like 'u__' or reviewer like 'u__';
--   delete from public.meetings        where organizer like 'u__';
--   delete from public.agent_machines  where person_id like 'u__';
--   delete from public.people          where id like 'u__';

-- --- AFTER ROLLOUT: learn true Windows logins from observed agent data ----
-- If some people's Windows sign-in name is NOT their email local-part,
-- their samples land unresolved. This shows who, with the real account the
-- agent observed, so you can fix just those rows (not all 91):
--
--   select s.windows_user, s.autodesk_user, count(*) samples,
--          max(s.sampled_at) last_seen
--   from public.agent_samples s
--   left join public.people p
--     on lower(p.username) = lower(s.windows_user)
--     or lower(p.username) = lower(split_part(s.windows_user,'\\',2))
--   where p.id is null and s.windows_user is not null
--   group by 1,2 order by samples desc;
--
-- Then for each: update public.people set username='DOMAIN\\theirlogin'
--                where id='<their email local-part>';
