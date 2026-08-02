SOFTWARE  REQUIREMENTS SPECIFICATION

(SRS)

Project:  Campus  Marketplace  Portal  (Buy  &  Sell  Used Items)

1.  Problem  Understanding In  many  colleges,  students  and  staff  have  unused  items  such  as  books,  calculators,  lab equipment,

electronics,

hostel

essentials,

and

bicycles.

Currently,

buying

and

selling

these

items

happens

through

WhatsApp

groups,

notice

boards,

or

word

of

mouth,

making

the

process

inefficient

and

unreliable.

A  centralized  campus  marketplace  is  needed  where  authenticated  college  users  can securely

buy

and

sell

items

within

the

institution.

2.  Target  Users Primary  Users

●  Students  ●  Teaching  Staff  ●  Non-Teaching  Staff Secondary  Users

●  College  Administration  (Admin)

3.  Problems  Faced  by  Target  Users Problem  Who  Faces  It?  Impact No  centralized  platform  Students  &  Staff  Difficult  to  find  buyers/sellers

Selling  through  WhatsApp  groups  Students  Messages  get  buried  quickly Fake  or  unknown  buyers  Students  &  Staff  Trust  and  security  issues No  easy  search  Buyers  Takes  time  to  find  products No  verification  of  users  Everyone  Risk  of  scams No  communication  system  Buyers  &  Sellers  Must  use  personal  phone  numbers Difficult  to  know  if  an  item  is  sold  Buyers  Wastes  time  contacting  sellers No  record  of  transactions  Users  No  purchase/selling  history Manual  coordination  Everyone  Time-consuming No  reporting  mechanism  Users  Difficult  to  report  fake  listings

4.  Proposed  Solution Develop  a  secure  web  portal  exclusively  for  college  students  and  staff  where  every authenticated

user

can

both

buy

and

sell

used

items.

The  system  provides:

●  Secure  login  using  institutional  email  ●  Product  listing  with  images  ●  Product  search  and  filtering  ●  Buyer–seller  chat  ●  Wishlist  ●  Product  status  (Available/Sold)  ●  Notifications  ●  Admin  moderation  ●  Reports  and  analytics

5.  Objectives

●  Create  a  trusted  campus  marketplace  ●  Reduce  waste  through  item  reuse  ●  Simplify  buying  and  selling  ●  Improve  communication  between  buyers  and  sellers  ●  Ensure  secure  and  transparent  transactions  ●  Digitize  the  existing  manual  process

6.  Core  Features

Authentication

●  College  email  login  ●  User  profile  ●  Role-based  access

Marketplace

●  Add  product  ●  Edit/Delete  listing  ●  Upload  multiple  images  ●  Product  categories

●  Product  details  page

Search  &  Discovery

●  Search  products  ●  Filter  by  category  ●  Filter  by  price  ●  Filter  by  condition

Buyer  Features

●  Browse  products  ●  Wishlist  ●  Chat  with  seller  ●  View  purchase  history

Seller  Features

●  Manage  listings  ●  Mark  item  as  sold  ●  View  selling  history

Admin  Features

●  Manage  users  ●  Approve/Remove  listings  ●  Handle  reports  ●  Dashboard  with  analytics

Notifications

●  New  messages  ●  Product  approval  ●  Product  sold  ●  Admin  announcements

7.  Functional  Requirements

●  User  Registration/Login  ●  User  Profile  Management  ●  Product  Management  ●  Search  &  Filter  ●  Chat  System  ●  Wishlist  ●  Notifications  ●  Admin  Dashboard  ●  Reporting  System  ●  Analytics  Dashboard

8.  Non-Functional  Requirements

●  Responsive  Design  ●  Secure  Authentication  ●  Fast  Search  ●  High  Availability  ●  Data  Security  ●  Scalable  Architecture  ●  Easy  Maintenance

9.  Technology  Stack Layer  Technology Frontend  React.js Styling  Tailwind  CSS Backend  Supabase Database  Supabase Authentication  Supabase  Authentication

Image  Storage  Supabase  Storage Notifications  Supabase  Cloud  Messaging  (FCM) Hosting  Supabase  Hosting Charts  Chart.js Version  Control  Git  &  GitHub  &  Vercel

10.  System  Workflow

11.  Expected  Benefits For  Students

●  Buy  affordable  second-hand  items  ●  Sell  unused  belongings  quickly  ●  Safe  transactions  within  the  campus  community For  Staff

●  Convenient  way  to  exchange  useful  items  ●  Trusted  buyers  and  sellers  ●  Less  dependency  on  informal  communication  channels For  College  Administration

●  Centralized  and  monitored  marketplace  ●  Reduced  misuse  compared  to  public  platforms  ●  Insights  through  analytics  and  reports

12.  Why  This  Solution?

●  ✔  Solves  the  lack  of  a  dedicated  campus  marketplace.  ●  ✔  Restricts  access  to  verified  college  users,  increasing  trust.  ●  ✔  Enables  every  user  to  act  as  both  a  buyer  and  a  seller.  ●  ✔  Reduces  waste  by  encouraging  reuse  of  products.  ●  ✔  Improves  efficiency  with  search,  chat,  notifications,  and  analytics.  ●  ✔  Uses  Supabase  services  for  a  scalable,  secure,  and  low-maintenance  solution suitable

for

a

college

project

or

hackathon.

ER  DIAGRAM:

FRONTEND  -  BACKEND  ARCHITECTURE

Conclusion The  Campus  Marketplace  Portal  provides  a  secure,  centralized,  and  user-friendly platform

for

college

students

and

staff

to

buy

and

sell

used

items

within

the

campus

community.

It

replaces

unorganized

methods

such

as

WhatsApp

groups,

notice

boards,

and

word-of-mouth

communication

with

a

reliable

digital

marketplace.

By  using  Supabase  Authentication,  Database,  Storage,  and  Realtime ,  the  system supports

secure

user

access,

product

management,

image

storage,

real-time

buyer–seller

communication,

and

efficient

data

management.

Features

such

as

product

search

and

filtering,

wishlist,

notifications,

product

status

tracking,

admin

moderation,

reporting,

and

analytics

improve

the

overall

user

experience

and

platform

reliability.

The  project  promotes  the  reuse  of  products,  reduces  waste,  helps  users  buy affordable

items,

and

allows

sellers

to

easily

find

interested

buyers.

Overall,

the

Campus

Marketplace

Portal

offers

a

practical,

scalable,

and

sustainable

solution

that

makes

campus

buying

and

selling

more

convenient,

transparent,

secure,

and

efficient.