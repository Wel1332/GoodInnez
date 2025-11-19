import { activities } from '../data/activities'
import ActivityCard from './ActivityCard'
import './ActivitiesSection.css'

export default function ActivitiesSection() {
  return (
    <section className="activities-section">
      <h2>Activities</h2>

      <div className="activities-grid">
        {activities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      <button className="view-all-btn">View All Hotels</button>
    </section>
  )
}
