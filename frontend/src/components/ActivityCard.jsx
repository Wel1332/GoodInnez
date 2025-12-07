export default function ActivityCard({ activity }) {
  return (
    <div className="flex-1 min-w-[300px] group cursor-pointer relative overflow-hidden rounded-3xl h-[300px]">
      <img src={activity.image} alt={activity.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
        <h3 className="text-2xl font-bold text-white mb-1">{activity.name}</h3>
        <p className="text-sm text-gray-300 font-medium uppercase tracking-wider">{activity.category}</p>
      </div>
    </div>
  );
}