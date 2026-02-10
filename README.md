# LuvBomba
A secret letter provider
💌 LoveBomb

LoveBomb is a playful, privacy-first web app for sending anonymous or semi-anonymous messages—by SMS or email—on a schedule.
Think: 90’s internet aesthetics meets modern consent, safety, and payments.

It’s designed for people who want to send affection, reminders, encouragement, or poetry without pressure, expectation, or immediate reply.

✨ What LoveBomb Is

A simple messaging service

Anonymous or pseudonymous

Messages sent later, not instantly

Designed to feel intentional, not spammy

Styled like a cozy, slightly chaotic 1990s website

🎨 Design Philosophy

UI

Early web vibes:

pixel fonts

pastel gradients

tiled backgrounds

blinking hearts (sparingly 👀)

low-fidelity buttons & forms

No infinite scroll

No dark patterns

No engagement bait

UX

Calm, deliberate flow

No public feeds

No “reply pressure”

Receiver never needs an account

💡 Core Features
💬 Message Sending

Send messages via:

SMS

Email

Message types:

Free-text

Prompt-assisted (gentle suggestions like “something you wish they knew”)

Optional anonymity:

Fully anonymous

Alias-based (“from someone thinking of you”)

⏰ Scheduling

Send messages:

One-time

Recurring (daily, weekly, monthly)

Date-specific (birthdays, anniversaries, reminders)

Time-zone aware

Preview before scheduling

🔒 Safety & Consent

Rate limits per sender

Content filtering (soft moderation, not surveillance)

Opt-out link included in every message

No message threads (prevents harassment loops)

No message history shown to receivers

💳 Payments (Simple & Honest)

LoveBomb charges small, transparent fees to cover delivery and infrastructure.

Pricing examples

$1–$3 per SMS

Free or low-cost email messages

Bundles (e.g. 10 messages)

Payment goals

Card payments only

No subscriptions required

One-click checkout

🧱 Suggested Technical Stack

This is intentionally lightweight.

Frontend

Next.js or simple React SPA

Tailwind CSS (customized to look un-modern)

Optional pixel or bitmap fonts

Minimal JavaScript animations

Backend

Node.js + Express

REST API (keep it boring)

Queue-based message sending

Messaging

SMS: Twilio or similar provider

Email: Resend, Postmark, or SES

Payments

Stripe Checkout

Handles cards

Handles receipts

Keeps you PCI-compliant

Payment tied to message job creation

Database

PostgreSQL or MongoDB

Store:

message content (encrypted at rest)

delivery schedule

payment reference

opt-out status

🧠 Data & Privacy Principles

No selling data

No message indexing for “insights”

Messages auto-delete after delivery window

Phone numbers/emails are hashed where possible

Logs are minimal and temporary

🗂️ Basic Data Models (Conceptual)
Message
- id
- content
- delivery_method (sms | email)
- recipient
- scheduled_time
- sender_alias
- is_anonymous
- status
- payment_id

Payment
- id
- provider (stripe)
- amount
- currency
- message_id
- status

🧪 MVP Scope

V0 Goals

Send 1 scheduled SMS or email

Pay once

Message delivers

Receiver can opt out

Out of Scope (for now)

User profiles

Chat threads

Social features

Analytics dashboards

AI-generated messages (maybe later 👀)

🌱 Future Ideas

Message “capsules” that unlock later

Seasonal themes (Valentine’s, Ramadan, birthdays)

Physical postcard integrations

Accessibility-first retro themes

Consent-based reply bridges (opt-in only)

❤️ Why LoveBomb Exists

Not everything needs to be instant.
Not every message needs a reply.
Some things are better when they arrive softly, later, and without obligation.
