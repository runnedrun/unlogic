import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { compose, spacing, palette } from '@material-ui/system'
import { styled } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { useHistory } from 'react-router-dom'

const { WithData } = require('unlogic-ui')
const useStyles = makeStyles(theme => ({
  typeSelector: {
    width:"250px"
  }
}))
const Box = styled(Grid)(compose(spacing, palette))

const NewOpportunity = WithData(({ opportunityTypes, currentUserId }) => {
  console.log("curre", currentUserId, opportunityTypes)
  const history = useHistory()
  const classes = useStyles()  
  const [opportunityName, setOpportunityName] = React.useState()
  const [selectedOpportunityType, setSelectedOpportunityType] = React.useState()

  const create = () => {
    window.D.opportunities().add({
      name: opportunityName,
      postingUser: currentUserId,
      type: selectedOpportunityType 
    }).then((ref) => {
      history.push(`edit/${ref.id}`)
    })
  }

  return (
    <Grid item container justify="center" xs={12}>
      <Box item container justify="center" direction="column" xs={8}>
        <Box item mb={2}>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"          
            onChange={e => setOpportunityName(e.target.value)}
            fullWidth
          />
        </Box>
        <Box container direction="row" mb={2}>
          <TextField
            className={classes.typeSelector}
            select
            label="Select"
            onChange={e => {
              setSelectedOpportunityType(e.target.value)
            }}
            helperText="Opportunity Type"
          >
            {opportunityTypes.map(type => (
              <MenuItem key={type.id} value={type.id}>
                <ListItemText primary={type.name} />
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box item>
          <Button onClick={create} variant="contained" color="primary">
            Create Opportunity
          </Button>
        </Box>
      </Box>
    </Grid>
  )
})

export default NewOpportunity
