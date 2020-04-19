import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import DashboardIcon from '@material-ui/icons/Dashboard'
import NewIcon from '@material-ui/icons/AddCircleOutline'
import ProfileIcon from '@material-ui/icons/AccountCircle'
import SettingsIcon from '@material-ui/icons/Settings'
import ListIcon from '@material-ui/icons/List'
import { useHistory, useLocation } from 'react-router-dom'
import List from '@material-ui/core/List'
import Collapse from '@material-ui/core/Collapse'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'

const { WithData } = require('unlogic-ui')


const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

export const MainListItems = WithData(({ currentUser, opportunityTypes }) => {  
  const history = useHistory()
  const location = useLocation()
  const classes = useStyles()

  currentUser = currentUser || {}
  return (
    <div>
      <ListItem button onClick={_ => history.push('/')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Your Opportunities" />
      </ListItem>
      <ListItem button onClick={_ => history.push('/all-opportunities')}>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="All Opportunities" />
      </ListItem>
      <ListItem button onClick={_ => history.push('/new-opportunity')}>
        <ListItemIcon>
          <NewIcon />
        </ListItemIcon>
        <ListItemText primary="New Opoportunity" />
      </ListItem>
      {currentUser.isAdmin ? (
        <div>
          <ListItem button onClick={_ => history.push('/opportunity-type/new')}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="New Opportunity Type" />
          </ListItem>
          <Collapse
            component="li"
            in={location.pathname.indexOf('opportunity-type') > -1}
            unmountOnExit
          >
            <List disablePadding>
              {opportunityTypes.map(type => {                
                return (
                  <ListItem
                    key={type.id}
                    button
                    onClick={_ => history.push(`/opportunity-type/${type.id}`)}
                    className={classes.nested}
                  >
                    <ListItemIcon>
                      <Icon>{type.icon}</Icon>
                    </ListItemIcon>
                    <ListItemText primary={type.name} />
                  </ListItem>
                )
              })}
            </List>
          </Collapse>
        </div>
      ) : (
        <span />
      )}
      <ListItem button onClick={_ => history.push('/profile')}>
        <ListItemIcon>
          <ProfileIcon />
        </ListItemIcon>
        <ListItemText primary="Your Profile" />
      </ListItem>
    </div>
  )
})

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <ListIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
  </div>
)
