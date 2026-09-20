interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    variant?: 'default' | 'warning'
}

const StatCard = ({title, value, subtitle, variant='default'}: StatCardProps)=>{
    const isWarning = variant == 'warning';

    return (<div className= {isWarning? "bg-amber-950/30 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm" : "bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm"}>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className={`text-3xl font-bold tracking-tight mt-2 ${isWarning? "text-amber-400" : "text-white"}`}>{value}</p>
        <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
    </div>);
}

export default StatCard;
