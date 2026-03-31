# Unified Self Evolution (USE) — Project Context

## Stack
- Next.js (App Router)
- Supabase (Auth, DB, Storage)
- Tailwind CSS

## Product vision
USE is a structured evolution platform.

Users progress through stages:
- base
- practitioner
- instructor

The platform combines:
- courses
- enrollments
- certifications
- public profiles
- future accreditation workflows

## Current completed functionality
- Supabase Auth is working
- Profiles are working
- Public usernames are working
- Public profile route works at /[username]
- Courses listing works
- Course detail page works
- Enrollments work
- Duplicate enrollment handling is working
- User progression from base to practitioner works
- Certificates table works
- Certificate records are created
- Basic PDF certificate generation works
- My Certificates page works
- Downloadable PDF generation works

## Current data model concepts

### profiles
Important fields:
- id
- email
- user_level
- therapist_accredited
- instructor_application_status
- username
- first_name
- middle_name
- last_name
- date_of_birth
- phone
- country_of_residence
- website
- bio
- avatar_url
- is_public

### user levels
- base
- practitioner
- instructor

### courses
Important fields:
- id
- title
- description
- course_type
- course_category
- start_date
- end_date
- price

### course_category
- practitioner
- instructor

### course_type
- practitioner_level_1
- practitioner_level_2
- practitioner_level_3
- practitioner_level_4
- instructor_level_1
- instructor_level_2
- instructor_level_3
- instructor_level_4

### enrollments
- user_id
- course_id
- status
- enrolled_at
- completed_at

### enrollment status
- enrolled
- completed

### certificates
Important fields:
- user_id
- course_id
- certificate_type
- certificate_title
- certificate_number
- issued_at
- pdf_url

### certificate_type
- completion
- accreditation

## Business rules

### Practitioner courses
- visible to everyone
- open for enrollment to everyone

### Instructor courses
- visible to everyone
- only users with therapist_accredited = true can enroll

### Progression
- users start as base
- when a practitioner course is completed, user_level becomes practitioner
- future instructor progression will require additional accreditation logic

## Important distinction
There are two different concepts:
1. course completion certificates
2. manual accreditation / board approval

These must remain separate.

## Current test data note
A practitioner course must always follow:
- course_type = practitioner_level_X
- course_category = practitioner

An instructor course must always follow:
- course_type = instructor_level_X
- course_category = instructor

## Current priority
We do NOT want to build accreditation yet.

We want to design the public website structure first.

## Immediate next goal
Design and implement the public site structure:
- global layout
- navbar
- landing page
- what is USE
- how it works
- clear navigation between public and private sections

## Public pages we likely need
- /
- /about
- /how-it-works
- /courses
- /courses/[id]
- /login
- /signup
- /[username]

## Private pages already existing
- /dashboard
- /profile
- /my-courses
- /my-certificates

## Development rules
- Give full files only, no fragments
- Keep architecture simple and scalable
- Keep naming consistent
- Use English in product/UI/database naming
- Do not over-engineer
- Preserve current working logic

## What I want from Codex
Act as my technical cofounder.
Guide me step by step.
Recommend the best next move instead of giving me too many options.
When changing code, give full files only.