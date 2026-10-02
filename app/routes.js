const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})

// Fictional branching example. Each screen has its own view and explicit route.
function equipmentErrors(res, page, errors, data) {
  return res.status(422).render(`event-equipment/${page}`, {
    data, errors,
    errorList: Object.entries(errors).map(([field, text]) => ({ href: `#${field}`, text }))
  })
}

router.get('/event-equipment/start', (req, res) => {
  res.render('event-equipment/start')
})
router.get('/event-equipment/eligibility', (req, res) => {
  res.render('event-equipment/eligibility')
})
router.post('/event-equipment/eligibility', (req, res) => {
  const errors = {}
  if (!['Yes', 'No'].includes(req.body.equipmentEligible)) errors.equipmentEligible = 'Select whether your event is in Camden'
  if (Object.keys(errors).length) return equipmentErrors(res, 'eligibility', errors, { ...req.session.data, ...req.body })
  req.session.data.equipmentEligible = req.body.equipmentEligible
  if (req.body.equipmentEligible === 'No') return res.redirect('/event-equipment/not-eligible')
  res.redirect('/event-equipment/fulfilment')
})
router.get('/event-equipment/not-eligible', (req, res) => {
  res.render('event-equipment/not-eligible')
})
router.get('/event-equipment/fulfilment', (req, res) => {
  res.render('event-equipment/fulfilment')
})
router.post('/event-equipment/fulfilment', (req, res) => {
  const errors = {}
  if (!['Collection', 'Delivery'].includes(req.body.equipmentFulfilment)) errors.equipmentFulfilment = 'Select collection or delivery'
  if (Object.keys(errors).length) return equipmentErrors(res, 'fulfilment', errors, { ...req.session.data, ...req.body })
  req.session.data.equipmentFulfilment = req.body.equipmentFulfilment
  if (req.body.equipmentFulfilment === 'Delivery') return res.redirect('/event-equipment/delivery')
  delete req.session.data.equipmentAddress
  res.redirect('/event-equipment/collection')
})
router.get('/event-equipment/delivery', (req, res) => {
  if (req.session.data.equipmentFulfilment !== 'Delivery') return res.redirect('/event-equipment/fulfilment')
  res.render('event-equipment/delivery')
})
router.post('/event-equipment/delivery', (req, res) => {
  if (req.session.data.equipmentFulfilment !== 'Delivery') return res.redirect('/event-equipment/fulfilment')
  const errors = {}
  if (!req.body.equipmentAddress?.trim()) errors.equipmentAddress = 'Enter the delivery address'
  if (Object.keys(errors).length) return equipmentErrors(res, 'delivery', errors, { ...req.session.data, ...req.body })
  req.session.data.equipmentAddress = req.body.equipmentAddress.trim()
  res.redirect('/event-equipment/contact')
})
router.get('/event-equipment/collection', (req, res) => {
  res.render('event-equipment/collection')
})
router.post('/event-equipment/collection', (req, res) => {
  res.redirect('/event-equipment/contact')
})
router.get('/event-equipment/contact', (req, res) => {
  res.render('event-equipment/contact')
})
router.post('/event-equipment/contact', (req, res) => {
  const errors = {}
  if (!['Email', 'Phone'].includes(req.body.equipmentContact)) errors.equipmentContact = 'Select how we should contact you'
  if (req.body.equipmentContact === 'Email') {
    if (!req.body.equipmentEmail?.trim()) errors.equipmentEmail = 'Enter your email address'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.equipmentEmail)) errors.equipmentEmail = 'Enter an email address in the correct format'
  }
  if (req.body.equipmentContact === 'Phone' && !req.body.equipmentPhone?.trim()) errors.equipmentPhone = 'Enter your phone number'
  if (Object.keys(errors).length) return equipmentErrors(res, 'contact', errors, { ...req.session.data, ...req.body })
  Object.assign(req.session.data, {
    equipmentContact: req.body.equipmentContact,
    equipmentEmail: req.body.equipmentContact === 'Email' ? req.body.equipmentEmail.trim() : '',
    equipmentPhone: req.body.equipmentContact === 'Phone' ? req.body.equipmentPhone.trim() : ''
  })
  res.redirect('/event-equipment/equipment')
})
router.get('/event-equipment/equipment', (req, res) => {
  res.render('event-equipment/equipment')
})
router.post('/event-equipment/equipment', (req, res) => {
  const errors = {}
  if (!['Tables', 'Chairs', 'Gazebo'].includes(req.body.equipment)) errors.equipment = 'Select the equipment you need'
  if (Object.keys(errors).length) return equipmentErrors(res, 'equipment', errors, { ...req.session.data, ...req.body })
  req.session.data.equipment = req.body.equipment
  delete req.session.data.gazeboLocation
  if (req.body.equipment === 'Gazebo') return res.redirect('/event-equipment/gazebo-location')
  res.redirect('/event-equipment/check-answers')
})
router.get('/event-equipment/gazebo-location', (req, res) => {
  if (req.session.data.equipment !== 'Gazebo') return res.redirect('/event-equipment/equipment')
  res.render('event-equipment/gazebo-location')
})
router.post('/event-equipment/gazebo-location', (req, res) => {
  if (req.session.data.equipment !== 'Gazebo') return res.redirect('/event-equipment/equipment')
  const errors = {}
  if (!['Camden park', 'Other outdoor space'].includes(req.body.gazeboLocation)) errors.gazeboLocation = 'Select where you will use the gazebo'
  if (Object.keys(errors).length) return equipmentErrors(res, 'gazebo-location', errors, { ...req.session.data, ...req.body })
  req.session.data.gazeboLocation = req.body.gazeboLocation
  if (req.body.gazeboLocation === 'Camden park') return res.redirect('/event-equipment/park-permission')
  res.redirect('/event-equipment/check-answers')
})
router.get('/event-equipment/park-permission', (req, res) => {
  if (req.session.data.equipment !== 'Gazebo' || req.session.data.gazeboLocation !== 'Camden park') return res.redirect('/event-equipment/equipment')
  res.render('event-equipment/park-permission')
})
router.post('/event-equipment/park-permission', (req, res) => {
  if (req.session.data.equipment !== 'Gazebo' || req.session.data.gazeboLocation !== 'Camden park') return res.redirect('/event-equipment/equipment')
  res.redirect('/event-equipment/check-answers')
})
router.get('/event-equipment/check-answers', (req, res) => {
  res.render('event-equipment/check-answers')
})
router.post('/event-equipment/check-answers', (req, res) => {
  res.redirect('/event-equipment/confirmation')
})
router.get('/event-equipment/confirmation', (req, res) => {
  res.render('event-equipment/confirmation')
})

router.get('/permit/start', (req, res) => {
  res.render('permit/start')
})

router.get('/permit/address', (req, res) => {
  res.render('permit/address')
})

router.post('/permit/address', (req, res) => {
  const { addressLine1, postcode } = req.body
  const errors = {}

  if (!addressLine1 || !addressLine1.trim()) {
    errors.addressLine1 = 'Enter the first line of your address'
  }

  if (!postcode || !postcode.trim()) {
    errors.postcode = 'Enter your postcode'
  }

  if (Object.keys(errors).length) {
    return res.status(422).render('permit/address', {
      errors,
      errorList: Object.entries(errors).map(([field, text]) => ({
        href: `#${field}`,
        text
      }))
    })
  }

  req.session.data.addressLine1 = addressLine1.trim()
  req.session.data.addressLine2 = req.body.addressLine2 && req.body.addressLine2.trim()
  req.session.data.postcode = postcode.trim().toUpperCase()

  res.redirect('/permit/check-answers')
})

router.get('/permit/check-answers', (req, res) => {
  res.render('permit/check-answers')
})

router.post('/permit/check-answers', (req, res) => {
  res.redirect('/permit/confirmation')
})

router.get('/permit/confirmation', (req, res) => {
  res.render('permit/confirmation')
})

router.get('/complaints', (req, res) => {
  res.redirect('/complaints/who-for')
})

router.get('/complaints/who-for', (req, res) => {
  res.render('complaints/who-for')
})

router.post('/complaints/who-for', (req, res) => {
  req.session.data.complaintFor = req.body.complaintFor || 'myself'
  req.session.data.hasPermission = req.body.hasPermission
  req.session.data.permissionDocument = req.body.complaintFor === 'someone-else' ? 'No file chosen' : undefined
  res.redirect('/complaints/service')
})

router.get('/complaints/service', (req, res) => {
  res.render('complaints/service')
})

router.post('/complaints/service', (req, res) => {
  req.session.data.service = req.body.service

  if (req.body.service === 'Community safety') {
    return res.redirect('/complaints/community-safety')
  }

  res.redirect('/complaints/previous-complaint')
})

router.get('/complaints/community-safety', (req, res) => {
  req.session.data.service = req.session.data.service || 'Community safety'
  res.render('complaints/community-safety')
})

router.post('/complaints/community-safety', (req, res) => {
  req.session.data.service = 'Community safety'
  req.session.data.communitySafetyArea = req.body.communitySafetyArea
  req.session.data.communitySafetyOther = req.body.communitySafetyOther
  res.redirect('/complaints/previous-complaint')
})

router.get('/complaints/previous-complaint', (req, res) => {
  res.render('complaints/previous-complaint')
})

router.post('/complaints/previous-complaint', (req, res) => {
  req.session.data.previousComplaint = req.body.previousComplaint || 'no'
  req.session.data.previousComplaintReference = req.body.previousComplaintReference
  res.redirect('/complaints/your-details')
})

router.get('/complaints/your-details', (req, res) => {
  res.render('complaints/your-details')
})

router.post('/complaints/your-details', (req, res) => {
  Object.assign(req.session.data, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    townOrCity: req.body.townOrCity,
    county: req.body.county,
    postcode: req.body.postcode,
    email: req.body.email,
    phone: req.body.phone,
    responseMethods: Array.isArray(req.body.responseMethods)
      ? req.body.responseMethods
      : req.body.responseMethods ? [req.body.responseMethods] : []
  })

  res.redirect('/complaints/complaint-details')
})

router.get('/complaints/complaint-details', (req, res) => {
  res.render('complaints/complaint-details')
})

router.post('/complaints/complaint-details', (req, res) => {
  Object.assign(req.session.data, {
    complaintDescription: req.body.complaintDescription,
    incidentDate: req.body.incidentDate,
    impact: req.body.impact,
    desiredOutcome: req.body.desiredOutcome
  })

  res.redirect('/complaints/supporting-documents')
})

router.get('/complaints/supporting-documents', (req, res) => {
  res.render('complaints/supporting-documents')
})

router.post('/complaints/supporting-documents', (req, res) => {
  req.session.data.supportingDocument = 'file.pdf'
  res.redirect('/complaints/reasonable-adjustments')
})

router.get('/complaints/reasonable-adjustments', (req, res) => {
  res.render('complaints/reasonable-adjustments')
})

router.post('/complaints/reasonable-adjustments', (req, res) => {
  req.session.data.needsAdjustments = req.body.needsAdjustments || 'no'
  req.session.data.adjustmentsDetails = req.body.adjustmentsDetails
  res.redirect('/complaints/confirmation')
})

router.get('/complaints/confirmation', (req, res) => {
  res.render('complaints/confirmation')
})

router.post('/clear-data', (req, res) => {
  req.session.data = {}
  res.redirect('/')
})

module.exports = router
