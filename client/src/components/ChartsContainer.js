import { useState } from 'react'
import { FaChartBar, FaChartArea } from 'react-icons/fa'

import BarChart from './BarChart'
import AreaChart from './AreaChart'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/ChartsContainer'

const ChartsContainer = () => {
  const [barChart, setBarChart] = useState(true)
  const { monthlyApplications: data } = useAppContext()
  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button type='button' className='chart-toggle-btn' onClick={() => setBarChart(!barChart)}>
        {barChart ? (
          <>
            <FaChartArea /> Switch to Area Chart
          </>
        ) : (
          <>
            <FaChartBar /> Switch to Bar Chart
          </>
        )}
      </button>
      {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
    </Wrapper>
  )
}

export default ChartsContainer
