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

const { WithData } = require('unlogic-ui')
const useStyles = makeStyles(theme => ({}))

const NewOpportunity = WithData(({ opportunityTypes }) => {
  opportunityTypes = opportunityTypes || [
    {
      name: 'Internship',
      icon: 'add_circle',
      formJson: '',
      id: 123456
    },
  ]

  const classes = useStyles()

  return (
    <Grid container justify="center">
      <Grid xs={6} item>
        <List>
          {opportunityTypes.map(type => {
            return (
              <ListItem key={type.id} button onClick={_ => (window.location = '/')}>
                <ListItemIcon>
                  <Icon>{type.icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={type.name} />
              </ListItem>
            )
          })}
        </List>
      </Grid>
    </Grid>
  )
})

export default NewOpportunity
