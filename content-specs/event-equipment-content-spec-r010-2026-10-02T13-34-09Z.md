# Event Equipment content specification

- Revision: r010
- Generated: 2026-10-02T13:34:09.111Z
- Timezone: Europe/London
- Generator version: 2.0.0
- Prototype kit version: 0.1.0
- Git commit: 62d7247
- Source fingerprint: d73ce01faa27

## Journey summary

| Page | Route | Type | Title |
| --- | --- | --- | --- |
| 1 | `/event-equipment/start` | start page | Borrow equipment for a community event |
| 2 | `/event-equipment/eligibility` | question page | Is your event in Camden? |
| 3 | `/event-equipment/not-eligible` | content page | This example service is for events in Camden |
| 4 | `/event-equipment/fulfilment` | question page | How will you get the equipment? |
| 5 | `/event-equipment/collection` | form page | Collecting your equipment |
| 6 | `/event-equipment/delivery` | question page | Where should we deliver the equipment? |
| 7 | `/event-equipment/contact` | question page | How should we contact you? |
| 8 | `/event-equipment/equipment` | question page | What equipment do you need? |
| 9 | `/event-equipment/gazebo-location` | question page | Where will you use the gazebo? |
| 10 | `/event-equipment/park-permission` | form page | Using a gazebo in a Camden park |
| 11 | `/event-equipment/check-answers` | check answers page | Check your answers |
| 12 | `/event-equipment/confirmation` | confirmation page | Request received |

## Coverage

Rendered scenario coverage; not an exhaustive proof of all possible answers. Sample values are fictional.

## Observed transitions

These are the routes exercised by the export scenarios. Each row records the page shown, the answer or action submitted, and the next page the prototype actually returned. They cover the scenarios chosen for this export, rather than every possible combination of answers.

| From | Action / scenario | To |
| --- | --- | --- |
| /event-equipment/start | Start now | /event-equipment/eligibility |
| /event-equipment/eligibility | Yes — event in Camden | /event-equipment/fulfilment |
| /event-equipment/eligibility | No — outside Camden | /event-equipment/not-eligible |
| /event-equipment/not-eligible | Change your answer | /event-equipment/eligibility |
| /event-equipment/fulfilment | Collection | /event-equipment/collection |
| /event-equipment/fulfilment | Delivery | /event-equipment/delivery |
| /event-equipment/collection | Continue | /event-equipment/contact |
| /event-equipment/delivery | Continue | /event-equipment/contact |
| /event-equipment/contact | Email supplied | /event-equipment/equipment |
| /event-equipment/contact | Phone supplied | /event-equipment/equipment |
| /event-equipment/equipment | Tables | /event-equipment/check-answers |
| /event-equipment/equipment | Gazebo | /event-equipment/gazebo-location |
| /event-equipment/gazebo-location | Camden park | /event-equipment/park-permission |
| /event-equipment/gazebo-location | Other outdoor space | /event-equipment/check-answers |
| /event-equipment/park-permission | Continue | /event-equipment/check-answers |
| /event-equipment/check-answers | Send request | /event-equipment/confirmation |
| /event-equipment/check-answers | Change event location | /event-equipment/eligibility |
| /event-equipment/check-answers | Change collection or delivery | /event-equipment/fulfilment |
| /event-equipment/check-answers | Change contact details | /event-equipment/contact |
| /event-equipment/check-answers | Change equipment | /event-equipment/equipment |
| /event-equipment/check-answers | Change delivery address | /event-equipment/delivery |
| /event-equipment/check-answers | Change gazebo location | /event-equipment/gazebo-location |

## 1. Borrow equipment for a community event

- Route: `/event-equipment/start`
- Page name: `start`
- Template: `app/views/event-equipment/start.njk`
- Page type: start page
- Browser title: Borrow equipment for a community event
- Headings: Borrow equipment for a community event
- Back link: None
- Next route: `/event-equipment/eligibility`
- Session data: None detected

### Page content

1. **Type:** Text
   - Text: This fictional example lets you request one piece of equipment for an event in Camden. You can collect it or ask for delivery.

2. **Type:** Link button
   - Text: Start now → `/event-equipment/eligibility`

## 2. Is your event in Camden?

- Route: `/event-equipment/eligibility`
- Page name: `eligibility`
- Template: `app/views/event-equipment/eligibility.njk`
- Page type: question page
- Browser title: Is your event in Camden?
- Headings: Is your event in Camden?
- Back link: Back → `/event-equipment/start`
- Next route: `/event-equipment/fulfilment`, `/event-equipment/not-eligible`
- Session data: None detected

### Page content

1. **Type:** Form component
   - Component: radio
   - Field name: `equipmentEligible`
   - Label or legend: Is your event in Camden?
   - Hint: Not specified
   - Required: See validation cases
   - Validation: Select whether your event is in Camden
   - Source line: 19
   - Options:
     - Yes
     - No

2. **Type:** Button
   - Text: Continue

### Verified validation cases

- **Missing required answer:**
  - equipmentEligible: Select whether your event is in Camden

## 3. This example service is for events in Camden

- Route: `/event-equipment/not-eligible`
- Page name: `not-eligible`
- Template: `app/views/event-equipment/not-eligible.njk`
- Page type: content page
- Browser title: This example service is for events in Camden
- Headings: This example service is for events in Camden
- Back link: Back → `/event-equipment/eligibility`
- Next route: `/event-equipment/eligibility`
- Session data: None detected

### Page content

1. **Type:** Text
   - Text: You cannot continue with a request for an event outside Camden.

## 4. How will you get the equipment?

- Route: `/event-equipment/fulfilment`
- Page name: `fulfilment`
- Template: `app/views/event-equipment/fulfilment.njk`
- Page type: question page
- Browser title: How will you get the equipment?
- Headings: How will you get the equipment?
- Back link: Back → `/event-equipment/eligibility`
- Next route: `/event-equipment/collection`, `/event-equipment/delivery`
- Session data: None detected

### Page content

1. **Type:** Form component
   - Component: radio
   - Field name: `equipmentFulfilment`
   - Label or legend: How will you get the equipment?
   - Hint: Not specified
   - Required: See validation cases
   - Validation: Select collection or delivery
   - Source line: 19
   - Options:
     - Collect it (value: `Collection`)
     - Have it delivered (value: `Delivery`)

2. **Type:** Button
   - Text: Continue

### Verified validation cases

- **Missing required answer:**
  - equipmentFulfilment: Select collection or delivery

## 5. Collecting your equipment

- Route: `/event-equipment/collection`
- Page name: `collection`
- Template: `app/views/event-equipment/collection.njk`
- Page type: form page
- Browser title: Collecting your equipment
- Headings: Collecting your equipment
- Back link: Back → `/event-equipment/fulfilment`
- Next route: `/event-equipment/contact`
- Session data: None detected

### Page content

1. **Type:** Text
   - Text: Collect your equipment from the example community centre. We will confirm the collection time after reviewing your request.

2. **Type:** Button
   - Text: Continue

## 6. Where should we deliver the equipment?

- Route: `/event-equipment/delivery`
- Page name: `delivery`
- Template: `app/views/event-equipment/delivery.njk`
- Page type: question page
- Browser title: Where should we deliver the equipment?
- Headings: Where should we deliver the equipment?
- Back link: Back → `/event-equipment/fulfilment`
- Next route: `/event-equipment/contact`
- Session data: None detected

### Page content

1. **Type:** Form component
   - Component: text
   - Field name: `equipmentAddress`
   - Label or legend: Delivery address
   - Hint: Not specified
   - Required: See validation cases
   - Validation: Enter the delivery address
   - Source line: 15

2. **Type:** Button
   - Text: Continue

### Verified validation cases

- **Missing required answer:**
  - equipmentAddress: Enter the delivery address

## 7. How should we contact you?

- Route: `/event-equipment/contact`
- Page name: `contact`
- Template: `app/views/event-equipment/contact.njk`
- Page type: question page
- Browser title: How should we contact you?
- Headings: How should we contact you?
- Back link: Back → `/event-equipment/collection`
- Next route: `/event-equipment/equipment`
- Session data: None detected

### Page content

1. **Type:** Text
   - Text: We will contact you when your equipment is ready to collect.

2. **Type:** Form component
   - Component: radio
   - Field name: `equipmentContact`
   - Label or legend: How should we contact you?
   - Hint: Not specified
   - Required: See validation cases
   - Validation: Select how we should contact you
   - Source line: 19
   - Options:
     - Email
       - Reveals:
         - **Email address**
           - Component: email
           - Field name: `equipmentEmail`
           - Hint: Not specified
           - Required: When shown (see validation cases)
           - Validation: Enter your email address; Enter an email address in the correct format
           - Source line: 22
     - Phone
       - Reveals:
         - **Phone number**
           - Component: tel
           - Field name: `equipmentPhone`
           - Hint: Not specified
           - Required: When shown (see validation cases)
           - Validation: Enter your phone number
           - Source line: 27

3. **Type:** Button
   - Text: Continue

### Verified validation cases

- **Missing required answer:**
  - equipmentContact: Select how we should contact you
- **Email selected without address:**
  - equipmentEmail: Enter your email address
- **Email has invalid format:**
  - equipmentEmail: Enter an email address in the correct format
- **Phone selected without number:**
  - equipmentPhone: Enter your phone number

## 7.1. How should we contact you?

- Rendered variant: Delivery — different introductory copy. This version has different visible content from the main page entry.
- Route: `/event-equipment/contact`
- Page name: `contact`
- Template: `app/views/event-equipment/contact.njk`
- Page type: question page
- Browser title: How should we contact you?
- Headings: How should we contact you?
- Back link: Back → `/event-equipment/delivery`
- Next route: Not determined
- Session data: None detected

### Page content

1. **Type:** Text
   - Text: We will contact you to arrange delivery.

2. **Type:** Form component
   - Component: radio
   - Field name: `equipmentContact`
   - Label or legend: How should we contact you?
   - Hint: Not specified
   - Required: Not specified
   - Validation: None detected
   - Source line: 19
   - Options:
     - Email
       - Reveals:
         - **Email address**
           - Component: email
           - Field name: `equipmentEmail`
           - Hint: Not specified
           - Required: Not specified
           - Validation: None detected
           - Source line: 22
     - Phone
       - Reveals:
         - **Phone number**
           - Component: tel
           - Field name: `equipmentPhone`
           - Hint: Not specified
           - Required: Not specified
           - Validation: None detected
           - Source line: 27

3. **Type:** Button
   - Text: Continue

## 8. What equipment do you need?

- Route: `/event-equipment/equipment`
- Page name: `equipment`
- Template: `app/views/event-equipment/equipment.njk`
- Page type: question page
- Browser title: What equipment do you need?
- Headings: What equipment do you need?
- Back link: Back → `/event-equipment/contact`
- Next route: `/event-equipment/check-answers`, `/event-equipment/gazebo-location`
- Session data: None detected

### Page content

1. **Type:** Form component
   - Component: radio
   - Field name: `equipment`
   - Label or legend: What equipment do you need?
   - Hint: Not specified
   - Required: See validation cases
   - Validation: Select the equipment you need
   - Source line: 19
   - Options:
     - Tables
     - Chairs
     - Gazebo

2. **Type:** Button
   - Text: Continue

### Verified validation cases

- **Missing required answer:**
  - equipment: Select the equipment you need

## 9. Where will you use the gazebo?

- Route: `/event-equipment/gazebo-location`
- Page name: `gazebo-location`
- Template: `app/views/event-equipment/gazebo-location.njk`
- Page type: question page
- Browser title: Where will you use the gazebo?
- Headings: Where will you use the gazebo?
- Back link: Back → `/event-equipment/equipment`
- Next route: `/event-equipment/park-permission`, `/event-equipment/check-answers`
- Session data: None detected

### Page content

1. **Type:** Form component
   - Component: radio
   - Field name: `gazeboLocation`
   - Label or legend: Where will you use the gazebo?
   - Hint: Not specified
   - Required: See validation cases
   - Validation: Select where you will use the gazebo
   - Source line: 15
   - Options:
     - Camden park
     - Other outdoor space

2. **Type:** Button
   - Text: Continue

### Verified validation cases

- **Missing required answer:**
  - gazeboLocation: Select where you will use the gazebo

## 10. Using a gazebo in a Camden park

- Route: `/event-equipment/park-permission`
- Page name: `park-permission`
- Template: `app/views/event-equipment/park-permission.njk`
- Page type: form page
- Browser title: Using a gazebo in a Camden park
- Headings: Using a gazebo in a Camden park
- Back link: Back → `/event-equipment/gazebo-location`
- Next route: `/event-equipment/check-answers`
- Session data: None detected

### Page content

1. **Type:** Text
   - Text: You will need permission from the park events team before using a gazebo. We will contact you about this after reviewing your request.

2. **Type:** Button
   - Text: Continue

## 11. Check your answers

- Route: `/event-equipment/check-answers`
- Page name: `check-answers`
- Template: `app/views/event-equipment/check-answers.njk`
- Page type: check answers page
- Browser title: Check your answers
- Headings: Check your answers
- Back link: Back → `/event-equipment/equipment`
- Next route: `/event-equipment/confirmation`, `/event-equipment/eligibility`, `/event-equipment/fulfilment`, `/event-equipment/contact`, `/event-equipment/equipment`, `/event-equipment/delivery`, `/event-equipment/gazebo-location`
- Session data: None detected

### Page content

1. **Type:** Summary list
   - **Event in Camden:** Yes
     - Actions: Change event location → `/event-equipment/eligibility`
   - **Collection or delivery:** Collection
     - Actions: Change collection or delivery → `/event-equipment/fulfilment`
   - **Contact details:** designer@example.test
     - Actions: Change contact details → `/event-equipment/contact`
   - **Equipment:** Tables
     - Actions: Change equipment → `/event-equipment/equipment`

2. **Type:** Button
   - Text: Send request

## 11.1. Check your answers

- Rendered variant: Delivery summary includes address. This version has different visible content from the main page entry.
- Route: `/event-equipment/check-answers`
- Page name: `check-answers`
- Template: `app/views/event-equipment/check-answers.njk`
- Page type: check answers page
- Browser title: Check your answers
- Headings: Check your answers
- Back link: Back → `/event-equipment/equipment`
- Next route: Not determined
- Session data: None detected

### Page content

1. **Type:** Summary list
   - **Event in Camden:** Yes
     - Actions: Change event location → `/event-equipment/eligibility`
   - **Collection or delivery:** Delivery
     - Actions: Change collection or delivery → `/event-equipment/fulfilment`
   - **Delivery address:** Example address, Camden
     - Actions: Change delivery address → `/event-equipment/delivery`
   - **Contact details:** 020 7946 0000
     - Actions: Change contact details → `/event-equipment/contact`
   - **Equipment:** Tables
     - Actions: Change equipment → `/event-equipment/equipment`

2. **Type:** Button
   - Text: Send request

## 11.2. Check your answers

- Rendered variant: Gazebo in a Camden park summary. This version has different visible content from the main page entry.
- Route: `/event-equipment/check-answers`
- Page name: `check-answers`
- Template: `app/views/event-equipment/check-answers.njk`
- Page type: check answers page
- Browser title: Check your answers
- Headings: Check your answers
- Back link: Back → `/event-equipment/park-permission`
- Next route: Not determined
- Session data: None detected

### Page content

1. **Type:** Summary list
   - **Event in Camden:** Yes
     - Actions: Change event location → `/event-equipment/eligibility`
   - **Collection or delivery:** Collection
     - Actions: Change collection or delivery → `/event-equipment/fulfilment`
   - **Contact details:** designer@example.test
     - Actions: Change contact details → `/event-equipment/contact`
   - **Equipment:** Gazebo
     - Actions: Change equipment → `/event-equipment/equipment`
   - **Gazebo location:** Camden park
     - Actions: Change gazebo location → `/event-equipment/gazebo-location`

2. **Type:** Button
   - Text: Send request

## 11.3. Check your answers

- Rendered variant: Gazebo in another outdoor space summary. This version has different visible content from the main page entry.
- Route: `/event-equipment/check-answers`
- Page name: `check-answers`
- Template: `app/views/event-equipment/check-answers.njk`
- Page type: check answers page
- Browser title: Check your answers
- Headings: Check your answers
- Back link: Back → `/event-equipment/gazebo-location`
- Next route: Not determined
- Session data: None detected

### Page content

1. **Type:** Summary list
   - **Event in Camden:** Yes
     - Actions: Change event location → `/event-equipment/eligibility`
   - **Collection or delivery:** Collection
     - Actions: Change collection or delivery → `/event-equipment/fulfilment`
   - **Contact details:** designer@example.test
     - Actions: Change contact details → `/event-equipment/contact`
   - **Equipment:** Gazebo
     - Actions: Change equipment → `/event-equipment/equipment`
   - **Gazebo location:** Other outdoor space
     - Actions: Change gazebo location → `/event-equipment/gazebo-location`

2. **Type:** Button
   - Text: Send request

## 12. Request received

- Route: `/event-equipment/confirmation`
- Page name: `confirmation`
- Template: `app/views/event-equipment/confirmation.njk`
- Page type: confirmation page
- Browser title: Request received
- Headings: Request received
- Back link: None
- Next route: Not determined
- Session data: None detected

### Page content

1. **Type:** Text
   - Text: This is a prototype. No equipment has been reserved.
