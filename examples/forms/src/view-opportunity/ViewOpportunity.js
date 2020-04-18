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
import { compose, spacing, palette, flexbox, display } from '@material-ui/system'
import FileUploader from 'react-firebase-file-uploader'
import Trash from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { useConfirm } from 'material-ui-confirm'
import { useHistory } from 'react-router-dom'

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

const Box = styled(Grid)(compose(spacing, palette, flexbox, display))

const ViewOpportunity = WithData(
  ({
    opportunity,
    dataSources,
    currentUserId,
    opportunityTypeForOpportunity,
  }) => {
    opportunity = opportunity || {}
    const userIsOwner = opportunity.postingUser === currentUserId
    const classes = useStyles()
    const typeJsonData = (opportunityTypeForOpportunity || {}).formFields || []
    const history = useHistory()

    const defaults = {
      bgColor: '#0F1C3F',
      textColor: '#7FDBFF',
      text: 'Banner Image',
    }

    const confirm = useConfirm()

    const deleteOpportunity = () => {
      confirm({
        description: 'Are you sure you want to delete this Opportunity?',
      }).then(() => {
        dataSources.opportunity.delete().then(() => {
          history.push('/')
        })
      })
    }

    const editButtons = userIsOwner ? (
      <Box  display="flex" alignItems="center">
        <Box item mr={2}>
          <Trash onClick={deleteOpportunity} />
        </Box>
        <Box item>
          <Edit onClick={() => history.push(`/opportunity/edit/${opportunity.id}`)} />
        </Box>
      </Box>
    ) : (
      ''
    )

    return (
      <Grid container justify="center">
        <Grid xs={8} item>
          <Paper>
            <Box container justifyContent="center" direction="column" p={2}>
              <Box container direction="row" mb={2}>
                <Box item mr={2}>
                  <Typography variant="h4">{opportunity.name}</Typography>
                </Box>
                {editButtons}
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
                <Typography variant="body1">
                  {opportunity.description}
                </Typography>
              </Box>
              {userIsOwner ? (
                <Box item p={3}>
                  <Typography variant="h5">View Applicants Below</Typography>
                </Box>
              ) : (
                <Box>
                  <Box item p={3}>
                    <Typography variant="h5">Apply Below</Typography>
                  </Box>
                  <Box>
                    <FormBuilder.ReactFormGenerator
                      answer_data={{}}
                      data={typeJsonData}
                      hide_actions
                    />
                  </Box>
                  <Box item p={3}>
                    <Button variant="contained" color="primary">
                      Apply
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    )
  }
)

const ViewOpportunityPage = () => {
  const { opportunityId } = useParams()
  return (
    <ViewOpportunity
      opportunityTypeForOpportunity={window.D.opportunityTypeForOpportunity(
        opportunityId
      ).data()}
      opportunity={window.D.opportunity(opportunityId).data()}
      currentUserId={window.currentUserObs.id}
    />
  )
}

export default ViewOpportunityPage
