import StatCard from "../components/StatCard";

const Dashboard = () => {
    return (
        <main className='max-w-7xl mx-auto px-6 py-8 space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <StatCard title="Total Products" value="1245" subtitle="Across all categories" />
                <StatCard title="Low Stock Items" value="45" subtitle="Products running low" variant="warning" />
                <StatCard title="Total Categories" value="12" subtitle="Across all categories" />
            </div>
        </main>
    )
}

export default Dashboard;