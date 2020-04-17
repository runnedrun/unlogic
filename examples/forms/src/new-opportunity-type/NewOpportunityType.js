import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

const FormBuilder = require('../components/form-builder/index')

const { useState } = React

const { WithData } = require('unlogic-ui')
const useStyles = makeStyles(theme => ({
  actionBar: { 'padding-bottom': '10px' },
}))

const EditOpportunityType = WithData(({ opportunityType, dataSources }) => {
  const json = (opportunityType || {}).formJSON
  const data = JSON.parse(json || '[]')
  const [oppportunityName, updateOpportunityName] = useState('')
  const history = useHistory()

  const save = () => {
    dataSources.opportunityType.set(
      { formJSON: JSON.stringify(data) },
      { merge: true }
    )
  }

  const classes = useStyles()

  const create = () => {
    window.D.opportunityTypesRaw()
      .add({
        name: oppportunityName,
      })
      .then(ref => {
        history.push(ref.id)
      })
  }

  const actionBar = opportunityType ? (
    <Grid container direction="row" spacing={2} className={classes.actionBar}>
      <Grid item>
        <Button onClick={save} variant="contained" color="primary">
          Save
        </Button>
      </Grid>
      <Grid item>
        <Typography>{opportunityType.name}</Typography>
      </Grid>
    </Grid>
  ) : (
    <Grid container direction="row" spacing={2} className={classes.actionBar}>
      <Grid item>
        <Button onClick={create} variant="contained" color="primary">
          Create
        </Button>
      </Grid>
      <Grid item>
        <TextField
          onChange={_ => updateOpportunityName(_.target.value)}
          id="outlined-basic"
          label="Name"
          variant="outlined"
        />
      </Grid>
    </Grid>
  )

  return (
    <Grid container>
      {actionBar}
      {opportunityType ? (
        <Grid container>
          <Grid item xs={12}>
            <FormBuilder.ReactFormBuilder
              onPost={data => console.log('data', data)}
              data={data}
            />
          </Grid>
        </Grid>
      ) : (
        ''
      )}
    </Grid>
  )
})

const NewOpportunityTypePage = () => {
  const classes = useStyles()
  const routeParams = useParams()

  const opportunityId = routeParams.opportunityTypeId

  return (
    <Grid container justify="center">
      <Grid xs={12} item>
        <EditOpportunityType
          opportunityType={window.D.opportunityType(opportunityId).data()}
        />
      </Grid>
    </Grid>
  )
}

export default NewOpportunityTypePage
