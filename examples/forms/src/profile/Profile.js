import React from 'react'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Trash from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { useConfirm } from 'material-ui-confirm'
import { useHistory } from 'react-router-dom'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'

const FormBuilder = require('../components/form-builder/index')
const simpleSvgPlaceholder = require('@cloudfour/simple-svg-placeholder')

require('firebase/firestore')

const { WithData } = require('unlogic-ui')

const useStyles = makeStyles(theme => ({
  bannerImage: {
    height: '300px',
    width: '600px',
    objectFit: 'contain',
  },
  opportunityTypeSelector: {
    width: '250px',
  },
}))

const OpoortunityTypeProfile = WithData(
  ({ opportunityType, answerData, setAnswers }) => {
    const [collapsed, setCollapsed] = React.useState(false)
    const formData = opportunityType.formFields || []
    answerData = answerData || {}

    const filteredFields = formData.filter(_ => _.isProfileField)

    return (
      <Box p={3}>
        <Box display="flex">
          <Typography>{opportunityType.name}</Typography>
          <Box onClick={_ => setCollapsed(!collapsed)}>
            {collapsed ? <ExpandMore /> : <ExpandLess />}
          </Box>
        </Box>
        <Box mt={2}>
          <Collapse component="div" in={!collapsed} unmountOnExit>
            <FormBuilder.ReactFormGenerator
              answer_data={answerData}
              data={filteredFields}
              setAnswers={setAnswers}
              hide_actions
            />
          </Collapse>
        </Box>
      </Box>
    )
  }
)

const UserProfile = WithData(
  ({ userProfile, dataSources, opportunityTypes }) => {
    userProfile = userProfile || {}
    const classes = useStyles()

    const defaults = {
      bgColor: '#0F1C3F',
      textColor: '#7FDBFF',
      text: 'Banner Image',
    }

    const confirm = useConfirm()
    console.log('user', userProfile)

    const profileAnswers = userProfile.profileAnswers || {}

    return (
      <Grid container justify="center">
        <Grid item xs={8}>
          <Paper>
            {opportunityTypes.map(type => {
              const answerData = profileAnswers[type.id] || {}
              Object.keys(answerData).map(fieldName => {
                answerData[fieldName] = JSON.parse(answerData[fieldName])
              })

              return (
                <OpoortunityTypeProfile
                  key={type.id}
                  setAnswers={answers => {
                    Object.keys(answers).forEach(fieldName => {
                      answers[fieldName] = JSON.stringify(answers[fieldName])
                    })
                    const updateObj = { profileAnswers: {} }
                    updateObj.profileAnswers[type.id] = answers
                    dataSources.userProfile.update(updateObj)
                  }}
                  opportunityType={type}
                  answerData={answerData}
                />
              )
            })}
          </Paper>
        </Grid>
      </Grid>
    )
  }
)

export default UserProfile
