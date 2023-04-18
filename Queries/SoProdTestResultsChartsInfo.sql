SELECT 
  Version, 
  AVG(TimeEllapsed) AS AverageRequestTime, 
  CONVERT(date, StartDate) AS StartDateOnly
FROM 
  TestResults 
GROUP BY 
  Version, 
  CONVERT(date, StartDate)
ORDER BY 
Version,
CONVERT(date, StartDate)
