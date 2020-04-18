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
import { compose, spacing, palette } from '@material-ui/system'
import { styled } from '@material-ui/core/styles'
import Trash from '@material-ui/icons/Delete'
import { useConfirm } from 'material-ui-confirm'
import Box from '@material-ui/core/Box'
import Store from '../components/form-builder/stores/store'

const FormBuilder = require('../components/form-builder/index')

const { useState } = React

const { WithData } = require('unlogic-ui')
const useStyles = makeStyles(theme => ({
  actionBar: { 'margin-bottom': '10px' },
}))

const EditOpportunityType = WithData(
  ({ opportunityType, dataSources, formBuilderStore }) => {
    const data = (opportunityType || {}).formFields || []
    data.forEach((_, index) => (_.index = index))
    const [oppportunityName, updateOpportunityName] = useState('')
    const history = useHistory()
    const confirm = useConfirm()

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

    const deleteType = () => {
      confirm({
        description: 'Are you sure you want to delete this Opportunity Type?',
      }).then(() => {
        dataSources.opportunityType.delete()
      })
    }

    const actionBar = opportunityType ? (
      <Grid container direction="row" spacing={2} className={classes.actionBar}>
        <Box width={300} mr={2}>
          <TextField
            label="Name"
            variant="outlined"
            onChange={e =>
              dataSources.opportunityType.set(
                { name: e.target.value },
                { merge: true }
              )
            }
            value={opportunityType.name}
          ></TextField>
        </Box>
        <Box>
          <Trash onClick={deleteType} />
        </Box>
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
                data={data}
                store={formBuilderStore}
              />
            </Grid>
          </Grid>
        ) : (
          ''
        )}
      </Grid>
    )
  }
)

const NewOpportunityTypePage = () => {
  const classes = useStyles()
  const routeParams = useParams()

  const opportunityId = routeParams.opportunityTypeId

  const getData = () =>
    new Promise(resolve => {
      const subscriber = window.D.opportunityType(opportunityId)
        .data('formFields')
        .subscribe(data => {
          resolve(data)
          subscriber.unsubscribe()
        })
    })
  const setData = data => {
    data.map(el => {
      Object.keys(el).forEach(key => {
        if (typeof el[key] === 'undefined') {
          delete el[key]
        }
      })
    })

    window.D.opportunityType(opportunityId).update({ formFields: data })
  }

  const formBuilderStore = new Store(getData, setData)

  return (
    <Grid container justify="center">
      <Grid xs={12} item>
        <EditOpportunityType
          opportunityType={window.D.opportunityType(opportunityId).data()}
          formBuilderStore={formBuilderStore}
        />
      </Grid>
    </Grid>
  )
}

export default NewOpportunityTypePage
