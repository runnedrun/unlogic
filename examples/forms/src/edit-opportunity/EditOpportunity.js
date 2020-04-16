import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { useParams } from 'react-router-dom'
import { styled } from '@material-ui/core/styles'
import { compose, spacing, palette } from '@material-ui/system'
const FormBuilder = require('../components/form-builder/index')

const { WithData } = require('unlogic-ui')
const useStyles = makeStyles(theme => ({}))

const Box = styled(Grid)(compose(spacing, palette))

const EditOpportunity = WithData(
  ({
    opportunity,
    opportunityTypes,
    dataSources,
    opportunityTypeForOpportunity,
  }) => {
    opportunity = opportunity || {}
    opportunityTypeForOpportunity = opportunityTypeForOpportunity || {}
    opportunityTypes = opportunityTypes || []
    const typeJson = (opportunityTypeForOpportunity || {}).formJSON
    const typeJsonData = JSON.parse(typeJson || '[]')

    const classes = useStyles()

    // console.log(
    //   'opportunity',
    //   opportunityTypes,
    //   opportunityTypeForOpportunity,
    //   opportunity
    // )

    return (
      <Grid container justify="center">
        <Grid xs={6} item>
          <Paper>
            <Grid container justify="center" direction="row">
              <Grid item>
                <Typography variant="h5">Basic Information</Typography>
              </Grid>
              <Grid item>
                <form className={classes.root} noValidate autoComplete="off">
                  <Box container direction="row" spacing={2} m={2}>
                    <Grid item>
                      <TextField
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        defaultValue={opportunity.name}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="outlined-basic"
                        multiline
                        rowsMax={4}
                        label="Description"
                        variant="outlined"
                        defaultValue={opportunity.description}
                      />
                    </Grid>
                  </Box>
                  <Box container direction="row" m={2}>
                    <TextField
                      id="standard-select-currency"
                      select
                      label="Select"
                      value={opportunity.type || ''}
                      onChange={e => {
                        const newType = e.target.value
                        dataSources.opportunity.set(
                          { type: newType },
                          { merge: true }
                        )
                      }}
                      helperText="Opportunity Type"
                    >
                      {opportunityTypes.map(type => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </form>
              </Grid>
              <Grid item container direction="column">
                <Grid item>
                  <Typography variant="h5">
                    Details needed for your {opportunityTypeForOpportunity.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <FormBuilder.ReactFormGenerator
                    onPost={data => console.log('data', data)}
                    answer_data={{}}
                    data={typeJsonData}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    )
  }
)

const EditOpportunityPage = () => {
  const { opportunityId } = useParams()
  return (
    <EditOpportunity
      opportunityTypeForOpportunity={window.D.opportunityTypeForOpportunity(
        opportunityId
      ).data()}
      opportunity={window.D.opportunity(opportunityId).data()}
      opportunityTypes={window.D.opportunityTypes()}
    />
  )
}

export default EditOpportunityPage
