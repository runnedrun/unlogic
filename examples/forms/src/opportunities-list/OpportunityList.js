import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const { WithData } = require('unlogic-ui')
const simpleSvgPlaceholder = require('@cloudfour/simple-svg-placeholder')

const defaults = {
  bgColor: '#0F1C3F',
  textColor: '#7FDBFF',
}

const useStyles = makeStyles(theme => ({
  opportunityContainer: {
    maxHeight: '20rem',
    padding: '10px',
    overflow: 'hidden',
  },
  bannerImage: {
    height: '12rem',
    display: 'block',
    marginBottom: '10px'
  },
}))

const OpportunityList = WithData(({ opportunities }) => {
  const classes = useStyles()
  opportunities = opportunities || []

  return (
    <Grid container direction="row" spacing={5}>
      {opportunities.map(opportunity => {
        return (
          <Grid xs={4} item key={opportunity.id}>
            <Paper
              className={classes.opportunityContainer}              
            >
              <img
                alt="banner"
                src={opportunity.bannerImage || simpleSvgPlaceholder(defaults)}
                className={classes.bannerImage}
              />
              <Typography variant="h5">{opportunity.name}</Typography>
              <Typography variant="subtitle1">
                {opportunity.description}
              </Typography>
            </Paper>
          </Grid>
        )
      })}
    </Grid>
  )
})

export default OpportunityList
