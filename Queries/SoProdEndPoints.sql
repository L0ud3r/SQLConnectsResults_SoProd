--select top 200 STRING_SPLIT(URL, ' ') as endpoint, URL from testexecutions
UPDATE TestResultExecutions
SET EndPoint = (select f.value +'/' AS 'data()' from (select top 3 value from STRING_SPLIT(SUBSTRING(URL, 1, CHARINDEX('(', URL) - 1), '/')) as f
        FOR XML PATH('')),
	Response = CASE
                   WHEN StatusCode = 200 
				   THEN SUBSTRING(URL, CHARINDEX('(', URL) + 1, CHARINDEX(')', URL) - CHARINDEX('(', URL) - 1)
               END

UPDATE TestResultExecutions
SET EndPoint = REPLACE(EndPoint,' ','')

UPDATE TestResultExecutions
SET EndPoint = LEFT(EndPoint, LEN(EndPoint) - 1)

UPDATE TestResultExecutions
SET EndPoint = LEFT(Endpoint, CHARINDEX('?', Endpoint + '?') - 1)

SELECT top 200
*
FROM TestResultExecutions

SELECT TOP 200
      LEFT(EndPoint, LEN(EndPoint) - 1)
  FROM TestResultExecutions

select Endpoint, AVG(TimeEllapsed) as AverageRequest
from TestResultExecutions
Where TestResultId > 4 AND TestResultId < 10
group by EndPoint


select
LEFT(EndPoint, LEN(EndPoint)) + '?' as teste
from TestResultExecutions

select Endpoint from TestResultExecutions
order by id
OFFSET     124658 ROWS
FETCH NEXT 10 ROWS ONLY;

select
URL,
-- as Endpoint,
CASE
    WHEN StatusCode = 200 
	THEN SUBSTRING(URL, CHARINDEX('(', URL) + 1, CHARINDEX(')', URL) - CHARINDEX('(', URL) - 1)
	ELSE NULL
END as Response
from TestResultExecutions

select
SUBSTRING(URL, 1, CHARINDEX('/', URL, CHARINDEX('/', URL, CHARINDEX('/', URL) + 1) + 1))
from TestResultExecutions

select TOP 800000 * from TestResultExecutions 

select StatusCode from TestResultExecutions 
GROUP BY StatusCode

select
URL,
SUBSTRING(URL, 1, CHARINDEX('(', URL) - 2) as Endpoint
from TestResultExecutions

