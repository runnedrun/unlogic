import React from 'react'
import Dashboard from './Dashboard'
import MaterialCardBasic from '../components//MaterialCardBasic'
import Grid from '@material-ui/core/Grid'
const { WithData } = require('unlogic-ui')

const OpportunityList = WithData(({ opportunities }) => {
  opportunities = opportunities || []
  return (
    <Grid xs={4} item>
      {opportunities.map(opportunity => {
        return (
          <MaterialCardBasic
            imgSrc={opportunity.bannerImage}
            key={opportunity.id}
            text={opportunity.description}
          />
        )
      })}
    </Grid>
  )
})

const OpportunityListPage = ({}) => {
  return (
    <Dashboard>
      <OpportunityList opportunities={window.D.opportunitiesForCurrentUser()} />
    </Dashboard>
  )
}

export default OpportunityListPage
