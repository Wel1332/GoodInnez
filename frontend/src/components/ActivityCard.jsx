import './ActivityCard.css'

export default function ActivityCard({ activity }) {
  return (
    <div className="activity-card">
      <div className="activity-image">
        <img src={activity.image || "/placeholder.svg"} alt={activity.name} />
      </div>
      
      <div className="activity-info">
        <h3 className="activity-name">{activity.name}</h3>
        <p className="activity-category">{activity.category}</p>
      </div>
    </div>
  )
}
