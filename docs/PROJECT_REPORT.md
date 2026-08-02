PROJECT  REPORT UniSwap  –  Campus  Marketplace  Web  Application Submitted  by Team  BOSE

●  Jana  K  (Team  Captain)  ●  Vijay  M  J  ●  Rizwan  Ahamed  K  ●  Vigneshwaran  S Department  of  Artificial  Intelligence  and  Machine  Learning Bannari  Amman  Institute  of  Technology Academic  Year:  2026–2027

Certificate (To  be  signed  by  your  Guide,  HOD,  and  Principal  as  per  your  college  format.)

Acknowledgement We  express  our  sincere  gratitude  to  our  guide,  the  Department  of  Artificial  Intelligence  and Machine

Learning,

and

Bannari

Amman

Institute

of

Technology

for

providing

us

with

the

opportunity

and

resources

to

complete

this

project.

We

also

thank

our

faculty

members,

classmates,

and

team

members

for

their

valuable

support

and

guidance

throughout

the

development

of

UniSwap

–

Campus

Marketplace

Web

Application .

Abstract UniSwap  is  a  web-based  campus  marketplace  developed  to  simplify  buying  and  selling among

students

and

staff

within

a

college

campus.

Existing

public

marketplaces

often

lack

campus-specific  trust,  making  transactions  less  convenient.  UniSwap  addresses  this challenge

by

providing

a

secure

platform

where

verified

users

can

list

products,

browse

available

items,

communicate

through

real-time

chat,

and

manage

transactions

efficiently.

The  application  is  built  using  React.js ,  Vite ,  HTML5 ,  CSS3 ,  and  JavaScript  for  the  frontend, while

Supabase

(PostgreSQL)

is

used

as

the

backend

database

with

Supabase

Realtime

enabling

instant

messaging.

The

platform

supports

authentication,

product

management,

dashboards,

notifications,

wishlist

functionality,

and

an

admin

approval

workflow.

The

modular

architecture

ensures

scalability

and

maintainability,

making

UniSwap

suitable

for

future

enhancements

such

as

AI-powered

recommendations,

online

payments,

and

mobile

application

support.

Keywords:  Campus  Marketplace,  React.js,  Supabase,  Realtime  Chat,  E-Commerce,  Web Application.

Table  of  Contents

1.  Introduction  2.  Problem  Statement  3.  Objectives  4.  Existing  System  5.  Proposed  System  6.  System  Requirements  7.  Feasibility  Study  8.  System  Architecture  9.  Module  Description  10.  Database  Design  11.  Technology  Stack  12.  Implementation  13.  Testing  14.  Results  15.  Future  Enhancements  16.  Conclusion  17.  References

Chapter  1  –  Introduction

1.1  Introduction

With  the  increasing  adoption  of  online  marketplaces,  students  and  staff  require  a  dedicated platform

to

exchange

books,

electronics,

hostel

essentials,

furniture,

and

other

items

within

the

campus

community.

Existing

platforms

are

designed

for

the

general

public

and

often

involve

issues

such

as

long-distance

travel,

unreliable

sellers,

and

lack

of

institutional

trust.

UniSwap  is  designed  specifically  for  educational  institutions,  allowing  verified  campus members

to

buy

and

sell

products

in

a

secure

environment.

By

integrating

product

listings,

real-time

communication,

and

user

dashboards

into

a

single

platform,

UniSwap

enhances

convenience

while

promoting

sustainable

reuse

of

resources

within

the

campus.

Chapter  2  –  Problem  Statement Students  frequently  face  challenges  in  buying  and  selling  used  items  within  the  campus. Public

marketplaces

lack

verification

mechanisms

for

campus

users,

resulting

in

trust

issues

and

communication

delays.

There

is

no

centralized

platform

that

enables

students

and

staff

to

exchange

products

efficiently

within

the

institution.

Chapter  3  –  Objectives Primary  Objective Develop  a  secure  web  application  that  enables  students  and  staff  to  buy  and  sell  products within

the

campus.

Secondary  Objectives

●  Provide  secure  authentication.  ●  Allow  users  to  list  and  manage  products.  ●  Support  real-time  buyer–seller  communication.  ●  Enable  product  search  and  category  filtering.  ●  Provide  wishlist  and  notification  features.  ●  Support  product  approval  before  publishing.

Chapter  4  –  Existing  System Current  alternatives  include:

●  OLX  ●  Facebook  Marketplace  ●  WhatsApp  Groups Limitations

●  No  campus  verification.  ●  Trust  and  safety  concerns.  ●  No  centralized  campus  marketplace.  ●  Difficult  product  discovery.  ●  Limited  organization  of  listings.

Chapter  5  –  Proposed  System UniSwap  provides  a  dedicated  campus  marketplace  with:

●  Secure  user  authentication.  ●  Product  listing  and  management.  ●  Search  and  filtering.  ●  Real-time  chat.  ●  Notifications.  ●  Wishlist.  ●  Admin  approval  workflow.  ●  Responsive  and  user-friendly  interface.

Chapter  6  –  System  Requirements Software  Requirements

●  React.js  ●  Vite  ●  HTML5  ●  CSS3  ●  JavaScript  ●  Supabase  (PostgreSQL)  ●  Git  &  GitHub  ●  Visual  Studio  Code Hardware  Requirements

Minimum

●  Intel  Core  i3  ●  8  GB  RAM  ●  10  GB  free  storage  ●  Internet  connection Recommended

●  Intel  Core  i5  or  above  ●  16  GB  RAM  ●  SSD  ●  Stable  internet  connection

Chapter  7  –  Feasibility  Study Technical  Feasibility The  selected  technologies  are  open-source,  widely  supported,  and  suitable  for  developing  a scalable

web

application.

Economic  Feasibility The  project  uses  free  development  tools  and  Supabase's  free  tier,  minimizing  development costs.

Operational  Feasibility The  application  is  easy  to  use  and  can  be  adopted  by  students  and  staff  with  minimal training.

Chapter  8  –  System  Architecture Users │ ▼

React  Frontend │ Authentication  Layer │ Supabase  Backend ┌──────────────┴──────────────┐ ▼                                        ▼ PostgreSQL  Database         Supabase  Realtime └──────────────┬──────────────┘ ▼ Product  Data,  Chat  &  Notifications

Chapter  9  –  Module  Description Authentication  Module

●  Login  ●  Create  Account  ●  Forgot  Password  ●  Session  Management Home  Module

●  Product  feed  ●  Categories  ●  Search  ●  Filters Seller  Module

●  Add  product  ●  Upload  images  ●  Optional  video  ●  Edit  listing

●  Delete  listing  ●  Approval  status Buyer  Module

●  Browse  products  ●  View  product  details  ●  Wishlist  ●  Chat  with  seller  ●  Make  offer Chat  Module

●  One-to-one  messaging  ●  Realtime  updates  ●  Typing  indicator  ●  Notifications  ●  Conversation  history Dashboard  Module

●  Profile  management  ●  My  listings  ●  Wishlist  ●  Notifications  ●  Statistics

Chapter  10  –  Database  Design Main  Tables

●  Users  ●  Products  ●  Product  Images  ●  Product  Videos  ●  Chat  Threads  ●  Chat  Messages  ●  Notifications  ●  Wishlist  ●  Product  Approval Explain  the  primary  keys,  foreign  keys,  and  relationships.  Include  your  ER  diagram  here.

Chapter  11  –  Technology  Stack Layer  Technology Frontend  React.js Build  Tool  Vite Styling  HTML5,  CSS3 Programming  JavaScript  (ES6+) Database  PostgreSQL  (Supabase) Backend  Services Supabase Realtime  Supabase  Realtime Version  Control  Git,  GitHub

Chapter  12  –  Implementation Describe  the  implementation  of  each  module:

●  Authentication  flow.  ●  Product  listing  process.

●  Product  approval  workflow.  ●  Dashboard  features.  ●  Chat  implementation  using  Supabase  Realtime.  ●  Notification  system.  ●  Search  and  filtering.  ●  Responsive  UI. Include  screenshots  of:

●  Login  page  ●  Registration  page  ●  Home  page  ●  Product  details  ●  Sell  product  page  ●  Dashboard  ●  Chat  interface  ●  Notifications

Chapter  13  –  Testing Types  of  Testing

●  Unit  Testing  ●  Integration  Testing  ●  Functional  Testing  ●  User  Interface  Testing Sample  Test  Cases Test  Case  Expected  Result  Status User  Login  Login  successful  Pass Create  Account User  registered  Pass Add  Product  Product  saved  Pass

Search  Product Correct  results  Pass Chat  Message  Delivered  in  real  time  Pass Wishlist  Product  added  Pass

Chapter  14  –  Results The  application  successfully  provides  a  complete  campus  marketplace  where  students  and staff

can

register,

list

products,

search

for

items,

communicate

through

real-time

chat,

and

manage

transactions.

The

responsive

interface

and

modular

architecture

ensure

smooth

operation

across

devices,

while

the

admin

approval

workflow

enhances

trust

and

security

within

the

marketplace.

Chapter  15  –  Future  Enhancements

●  AI-based  product  recommendations.  ●  AI  chatbot  for  user  assistance.  ●  Product  rating  and  review  system.  ●  Online  payment  gateway  integration.  ●  QR-code  verification  for  transactions.  ●  Email  and  push  notifications.  ●  Mobile  application  (Android/iOS).  ●  Analytics  dashboard.  ●  Advanced  admin  controls.

Chapter  16  –  Conclusion UniSwap  demonstrates  the  practical  application  of  modern  web  technologies  in  solving  a real-world

campus

problem.

The

project

provides

a

secure,

responsive,

and

scalable

marketplace

that

improves

the

buying

and

selling

experience

for

students

and

staff.

By

integrating  real-time  communication,  product  management,  and  user-friendly  dashboards, the

system

creates

a

trusted

environment

for

campus

transactions.

Its

modular

design

allows

future

enhancements,

making

it

suitable

for

broader

institutional

adoption.

References

1.  React  Documentation  – https://react.dev 2.  Vite  Documentation  – https://vite.dev 3.  Supabase  Documentation  – https://supabase.com/docs 4.  PostgreSQL  Documentation  – https://www.postgresql.org/docs/ 5.  MDN  Web  Docs  – https://developer.mozilla.org 6.  Git  Documentation  – https://git-scm.com/doc