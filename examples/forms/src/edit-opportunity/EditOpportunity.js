import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { useParams } from 'react-router-dom'
import { styled } from '@material-ui/core/styles'
import { compose, spacing, palette } from '@material-ui/system'
import FileUploader from 'react-firebase-file-uploader'

const FormBuilder = require('../components/form-builder/index')
const firebase = require('firebase')
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

    const defaults = {
      bgColor: '#0F1C3F',
      textColor: '#7FDBFF',
      text: 'Banner Image',
    }

    const handleBannerImageUploadSuccess = filename => {
      console.log('filenam', filename)
      firebase
        .storage()
        .ref('banner-images')
        .child(filename)
        .getDownloadURL()
        .then(url =>
          dataSources.opportunity.set({ bannerImage: url }, { merge: true })
        )
    }

    return (
      <Grid container justify="center">
        <Grid xs={8} item>
          <Paper>
            <Box container justify="center" direction="column" p={2}>
              <Grid item>
                <Typography variant="h5">Basic Information</Typography>
              </Grid>
              <Box item container direction="row" mb={2}>
                <TextField
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  defaultValue={opportunity.name}
                  onChange={e =>
                    dataSources.opportunity.set(
                      { name: e.target.value },
                      { merge: true }
                    )
                  }
                  fullWidth
                />
              </Box>
              <Box item container justifyContent={'center'} mb={2}>
                <Button variant="contained" component="label">
                  Change Banner Image
                  <FileUploader
                    style={{ display: 'none' }}
                    accept="image/*"
                    name="banner-image"
                    randomizeFilename
                    storageRef={firebase.storage().ref('banner-images')}
                    onUploadSuccess={handleBannerImageUploadSuccess}
                  />
                </Button>
              </Box>
              <Box container item mb={2}>
                <img
                  alt={'banner'}
                  src={
                    opportunity.bannerImage || simpleSvgPlaceholder(defaults)
                  }
                  className={classes.bannerImage}
                />
              </Box>
              <Box item container mb={2}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  multiline
                  rowsMax={4}
                  label="Description"
                  variant="outlined"
                  defaultValue={opportunity.description}
                  onChange={e =>
                    dataSources.opportunity.set(
                      { description: e.target.value },
                      { merge: true }
                    )
                  }
                />
              </Box>
              <Box container direction="row">
                <TextField
                  className={classes.opportunityTypeSelector}
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
              <Box item p={3}>
                <Typography variant="h5">
                  Sample application form for your{' '}
                  {opportunityTypeForOpportunity.name}
                </Typography>
              </Box>
              <Box item p={3}>
                <FormBuilder.ReactFormGenerator
                  onPost={data => console.log('data', data)}
                  answer_data={{}}
                  data={typeJsonData}
                  hide_actions
                />
              </Box>
            </Box>
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
