# Bitcoin vs Auto-GPT

### Stars

```total_stars_comparison
select 
  concat(repos.owner, "/", repos.name) as name, 
  count(*) 
from starred_repos inner join repos on repos.id = starred_repos.repo_id 
group by 1 
order by 2 asc;
```

<DataTable data={total_stars_comparison} />


### Stars per Month

```stars_per_month_comparison
SELECT date_format(starred_repos.starred_at, '%Y-%m-01') AS date,
       SUM(CASE WHEN repos.name = 'bitcoin' THEN 1 ELSE 0 END) AS bitcoin_total,
      SUM(CASE WHEN repos.name = 'Auto-GPT' THEN 1 ELSE 0 END) AS auto_gpt_total
FROM starred_repos
JOIN repos ON starred_repos.repo_id = repos.id 
group by 1
ORDER BY 1 ASC;
```

<BarChart 
  data={stars_per_month_comparison} 
  x=date 
  y={["bitcoin_total", "auto_gpt_total"]} title="Bitcoin VS Auto-GPT" />

### Stars History

```stars_history_comparison

WITH stars_per_month AS (
  SELECT date_format(starred_repos.starred_at, '%Y-%m-01') AS date,
        SUM(CASE WHEN repos.name = 'bitcoin' THEN 1 ELSE 0 END) AS bitcoin_total,
        SUM(CASE WHEN repos.name = 'Auto-GPT' THEN 1 ELSE 0 END) AS auto_gpt_total
  FROM starred_repos
  JOIN repos ON starred_repos.repo_id = repos.id 
  group by 1
  ORDER BY 1 ASC
)
SELECT date,
       SUM(bitcoin_total) OVER (ORDER BY date ASC) AS bitcoin_total,
       SUM(auto_gpt_total) OVER (ORDER BY date ASC) AS auto_gpt_total
FROM stars_per_month
ORDER BY 1 ASC;
```

<LineChart 
  data={stars_history_comparison} 
  x=date 
  y={["bitcoin_total", "auto_gpt_total"]} title="Bitcoin VS Auto-GPT" />


### What day did the singularity occur when the number of Auto GPT stars exceeded the number of Bitcoin stars?

```singularity_date
with star_history_tmp as (
  SELECT DATE(starred_repos.starred_at) AS date,
         SUM(CASE WHEN repos.name = 'bitcoin' THEN 1 ELSE 0 END) OVER (ORDER BY DATE(starred_repos.starred_at)) AS bitcoin_total,
         SUM(CASE WHEN repos.name = 'Auto-GPT' THEN 1 ELSE 0 END) OVER (ORDER BY DATE(starred_repos.starred_at)) AS auto_gpt_total
  FROM starred_repos
  JOIN repos ON starred_repos.repo_id = repos.id
  ORDER BY DATE(starred_repos.starred_at) ASC
) 
select date, bitcoin_total, auto_gpt_total from star_history_tmp where auto_gpt_total > bitcoin_total order by date asc limit 1;
```

<DataTable data={singularity_date} />

### How many days did it take for the number of stars for Auto GPT to exceed the number of stars for Bitcoin?

```days_to_singularity
with star_history_daily as (
  SELECT date(starred_repos.starred_at) AS date,
        SUM(CASE WHEN repos.name = 'bitcoin' THEN 1 ELSE 0 END) AS bitcoin_total,
        SUM(CASE WHEN repos.name = 'Auto-GPT' THEN 1 ELSE 0 END) AS auto_gpt_total
  FROM starred_repos
  JOIN repos ON starred_repos.repo_id = repos.id 
  group by 1
  ORDER BY 1 ASC
),

star_history as (
  SELECT date,
         SUM(bitcoin_total) OVER (ORDER BY date ASC) AS bitcoin_total,
         SUM(auto_gpt_total) OVER (ORDER BY date ASC) AS auto_gpt_total
  FROM star_history_daily
  ORDER BY 1 ASC
),

singularity_date as (
  select date from star_history where auto_gpt_total > bitcoin_total order by date asc limit 1
),

start_date as (
  select min(date) as date from star_history where auto_gpt_total > 0
)

select 
  datediff(
  singularity_date.date,
  start_date.date
) as days from start_date, singularity_date;
```

<BigValue data={days_to_singularity} value=days />

### What is avg followers of the users who starred Auto GPT?

```avg_followers
select avg(followers_count) as avg from users inner join starred_repos on starred_repos.user_id = users.id inner join repos on repos.id = starred_repos.repo_id where repos.name = 'Auto-GPT';
```

<BigValue data={avg_followers} value=avg />

### What avg followers of the users who starred Bitcoin?

```avg_followers_bitcoin
select avg(followers_count) as avg from users inner join starred_repos on starred_repos.user_id = users.id inner join repos on repos.id = starred_repos.repo_id where repos.name = 'bitcoin';
```

<BigValue data={avg_followers_bitcoin} value=avg />


### morr insight coming soon

To be continued...
