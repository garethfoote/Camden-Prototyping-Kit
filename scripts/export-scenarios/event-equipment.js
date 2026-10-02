// Synthetic answers only. Content and destinations are extracted from real routes.
const prefix = '/event-equipment/'
const collection = { equipmentEligible: 'Yes', equipmentFulfilment: 'Collection', equipmentContact: 'Email', equipmentEmail: 'designer@example.test', equipment: 'Tables' }
const delivery = { ...collection, equipmentFulfilment: 'Delivery', equipmentAddress: 'Example address, Camden', equipmentContact: 'Phone', equipmentPhone: '020 7946 0000' }
const gazeboInPark = { ...collection, equipment: 'Gazebo', gazeboLocation: 'Camden park' }
const gazeboElsewhere = { ...collection, equipment: 'Gazebo', gazeboLocation: 'Other outdoor space' }
const invalid = (body = {}, label = 'Missing required answer') => ({ body, label, status: 422 })
const submit = (body, to, label, kind) => ({ body, expected: prefix + to, label, kind })
const page = (slug, data = {}, submissions = [], label = 'Default') => ({ path: prefix + slug, data, submissions, label })
module.exports = [
  page('start'),
  page('eligibility', {}, [invalid(), submit({ equipmentEligible: 'Yes' }, 'fulfilment', 'Yes — event in Camden'), submit({ equipmentEligible: 'No' }, 'not-eligible', 'No — outside Camden')]),
  page('not-eligible'),
  page('fulfilment', collection, [invalid(), submit({ equipmentFulfilment: 'Collection' }, 'collection', 'Collection'), submit({ equipmentFulfilment: 'Delivery' }, 'delivery', 'Delivery')]),
  page('collection', collection, [submit({}, 'contact', 'Continue')]),
  page('delivery', delivery, [invalid(), submit({ equipmentAddress: delivery.equipmentAddress }, 'contact', 'Continue')]),
  page('contact', collection, [invalid(), invalid({ equipmentContact: 'Email' }, 'Email selected without address'), invalid({ equipmentContact: 'Email', equipmentEmail: 'wrong' }, 'Email has invalid format'), invalid({ equipmentContact: 'Phone' }, 'Phone selected without number'), submit({ equipmentContact: 'Email', equipmentEmail: collection.equipmentEmail }, 'equipment', 'Email supplied'), submit({ equipmentContact: 'Phone', equipmentPhone: delivery.equipmentPhone }, 'equipment', 'Phone supplied')], 'Collection — email or phone'),
  page('contact', delivery, [], 'Delivery — different introductory copy'),
  page('equipment', collection, [invalid(), submit({ equipment: 'Tables' }, 'check-answers', 'Tables'), submit({ equipment: 'Gazebo' }, 'gazebo-location', 'Gazebo')]),
  page('gazebo-location', gazeboInPark, [invalid(), submit({ gazeboLocation: 'Camden park' }, 'park-permission', 'Camden park'), submit({ gazeboLocation: 'Other outdoor space' }, 'check-answers', 'Other outdoor space')]),
  page('park-permission', gazeboInPark, [submit({}, 'check-answers', 'Continue')]),
  page('check-answers', collection, [submit({}, 'confirmation', 'Send request')], 'Collection summary'),
  page('check-answers', delivery, [], 'Delivery summary includes address'),
  page('check-answers', gazeboInPark, [], 'Gazebo in a Camden park summary'),
  page('check-answers', gazeboElsewhere, [], 'Gazebo in another outdoor space summary'),
  page('confirmation', collection),
  { ...page('delivery', collection), expectedRedirect: prefix + 'fulfilment', label: 'Delivery is not selected' },
  { ...page('gazebo-location', collection), expectedRedirect: prefix + 'equipment', label: 'Gazebo is not selected' },
  { ...page('park-permission', gazeboElsewhere), expectedRedirect: prefix + 'equipment', label: 'Camden park is not selected' }
]
