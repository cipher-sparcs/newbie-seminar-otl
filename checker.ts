import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import lodash from 'lodash'


const prisma = new PrismaClient()




function problem1() {
  return prisma.$queryRaw`select firstName, lastName, income 
  from Customer 
  where income <= 60000 and income >= 50000 
  order by income desc, lastName asc, firstName asc 
  LIMIT 10;`
}

function problem2() {
  return prisma.$queryRaw`select * from Customer`
}

function problem3() {
  return prisma.$queryRaw`select firstName, lastName, income 
  from Customer 
  where income >= (select max(income) from Customer where lastName = 'Butler')*2 
  order by lastName asc, firstName asc 
  LIMIT 10` 
}

function problem4() {
  return prisma.$queryRaw`select Customer.customerID, Customer.income, Account.accNumber, Account.branchNumber 
  from Customer JOIN Owns ON Customer.customerID = Owns.customerID JOIN Account ON Owns.accNumber = Account.accNumber 

  where Customer.income > 80000 AND Customer.customerID 
  IN (SELECT Owns.customerID FROM Owns JOIN Account ON Owns.accNumber = Account.accNumber WHERE Account.branchNumber IN (1, 2) GROUP BY Owns.customerID HAVING COUNT(DISTINCT Account.branchNumber) = 2)
  ORDER BY Customer.customerID ASC, Account.accNumber ASC
  LIMIT 10;
  `
}

function problem5() {
  return prisma.$queryRaw`select Customer.customerID, Account.type, Account.accNumber, Account.balance
  from Customer JOIN Owns on Customer.customerID = Owns.customerID JOIN Account on Account.accNumber = Owns.accNumber
  where Account.type = 'BUS' or Account.type = 'SAV'
  ORDER BY Customer.customerID ASC, Account.type ASC, Account.accNumber ASC
  LIMIT 10;
  `
}

function problem6() {
  return prisma.$queryRaw`select Branch.branchName, Account.accNumber, Account.balance
  from Account JOIN Branch on Account.branchNumber = Branch.branchNumber
  where Account.balance >=100000 and Branch.managerSIN = 55700
  ORDER BY Account.accNumber ASC
  LIMIT 10;`
} /* bank sql에서 그냥 Philip SIN 찾아서 삽입입 */

function problem7() {
  return prisma.$queryRaw`select distinct Owns.customerID
  from Owns JOIN Account on Owns.accNumber=Account.accNumber JOIN Branch on Account.branchNumber=Branch.branchNumber
  where Branch.branchNumber = 3 and Owns.customerID not in (SELECT Owns.customerID FROM Owns JOIN Owns AS OtherOwns ON Owns.accNumber = OtherOwns.accNumber WHERE OtherOwns.customerID IN (SELECT Owns.customerID FROM Owns JOIN Account ON Owns.accNumber = Account.accNumber JOIN Branch ON Account.branchNumber = Branch.branchNumber WHERE Branch.branchNumber = 1))
  ORDER BY Owns.customerID asc
  LIMIT 10;`
}

function problem8() {
  return prisma.$queryRaw`select Employee.sin, Employee.firstName, Employee.lastName, Employee.salary, Branch.branchName 
  from Employee LEFT JOIN Branch  on Employee.sin = Branch.managerSIN 
  where Employee.salary > 50000 
  ORDER BY Branch.branchName DESC, Employee.firstName ASC 
  LIMIT 10`;
}

function problem9() {
  return prisma.$queryRaw`select Employee.sin, Employee.firstName, Employee.lastName, Employee.salary, (select Branch.branchName FROM Branch WHERE Branch.managerSIN = Employee.sin LIMIT 1) AS branchName 
    from Employee 
    WHERE Employee.salary > 50000 
    ORDER BY branchName DESC, Employee.firstName ASC 
    LIMIT 10;
`

}

function problem10() {
  return prisma.$queryRaw`SELECT 
    Customer.customerID, 
    Customer.firstName, 
    Customer.lastName, 
    Customer.income
FROM 
    Customer
WHERE 
    Customer.income > 5000 
    AND NOT EXISTS (
        SELECT HelenBranch.branchNumber
        FROM Owns AS HelenOwns
        JOIN Account AS HelenAccount ON HelenOwns.accNumber = HelenAccount.accNumber
        JOIN Branch AS HelenBranch ON HelenAccount.branchNumber = HelenBranch.branchNumber
        JOIN Customer AS Helen ON HelenOwns.customerID = Helen.customerID
        WHERE 
            Helen.firstName = 'Helen' 
            AND Helen.lastName = 'Morgan' 
            AND HelenBranch.branchNumber NOT IN (
                SELECT HelenBranch.branchNumber
                FROM Owns
                JOIN Account ON Owns.accNumber = Account.accNumber
                JOIN Branch ON Account.branchNumber = HelenBranch.branchNumber
                WHERE Owns.customerID = Customer.customerID
            )
    )
ORDER BY 
    Customer.income DESC;
`
}

function problem11() {
  return prisma.$queryRaw`SELECT 
    Employee.sin, 
    Employee.firstName, 
    Employee.lastName, 
    Employee.salary
FROM 
    Employee
JOIN 
    Branch ON Employee.branchNumber = Branch.branchNumber
WHERE 
    Branch.branchName = 'Berlin' 
    AND Employee.salary = (
        SELECT MIN(Employee.salary) 
        FROM Employee
        JOIN Branch ON Employee.branchNumber = Branch.branchNumber
        WHERE Branch.branchName = 'Berlin'
    )
ORDER BY Employee.sin ASC;
`
}

function problem14() {
  return prisma.$queryRaw`select * from Customer`
}

function problem15() {
  return prisma.$queryRaw`SELECT 
    Customer.customerID, 
    Customer.firstName, 
    Customer.lastName
FROM 
    Customer
JOIN 
    Owns ON Customer.customerID = Owns.customerID
JOIN 
    Account ON Owns.accNumber = Account.accNumber
JOIN 
    Branch ON Account.branchNumber = Branch.branchNumber
GROUP BY 
    Customer.customerID, 
    Customer.firstName, 
    Customer.lastName
HAVING 
    COUNT(DISTINCT Branch.branchName) = 4
ORDER BY 
    Customer.lastName ASC, 
    Customer.firstName ASC;
`
}


function problem17() {
  return prisma.$queryRaw`SELECT
    Customer.customerID,
    Customer.firstName,
    Customer.lastName,
    Customer.income,
    AVG(Account.balance) AS \`average account balance\`
FROM 
    Customer
JOIN 
    Owns ON Customer.customerID = Owns.customerID
JOIN 
    Account ON Owns.accNumber = Account.accNumber
WHERE 
    Customer.lastName LIKE 'S%' 
    AND Customer.lastName LIKE '%e%'
GROUP BY 
    Customer.customerID, 
    Customer.firstName, 
    Customer.lastName, 
    Customer.income
HAVING 
    COUNT(DISTINCT Account.accNumber) >= 3
ORDER BY 
    Customer.customerID ASC;

`
}

function problem18() {
  return prisma.$queryRaw`SELECT
    Account.accNumber,
    MAX(Account.balance) AS balance,
    SUM(Transactions.amount) AS \`sum of transaction amounts\`
FROM 
    Account
JOIN 
    Transactions ON Account.accNumber = Transactions.accNumber
JOIN 
    Branch ON Account.branchNumber = Branch.branchNumber
WHERE 
    Branch.branchName = 'Berlin'
GROUP BY 
    Account.accNumber
HAVING COUNT(Transactions.transNumber) >= 10
ORDER BY 
    \`sum of transaction amounts\` ASC
LIMIT 10;`;
}

const ProblemList = [
  problem1, problem2, problem3, problem4, problem5, problem6, problem7, problem8, problem9, problem10,
  problem11, problem14, problem15, problem17, problem18
]


async function main() {
  for (let i = 0; i < ProblemList.length; i++) {
    const result = await ProblemList[i]()
    const answer =  JSON.parse(fs.readFileSync(`${ProblemList[i].name}.json`,'utf-8'));
    lodash.isEqual(result, answer) ? console.log(`${ProblemList[i].name}: Correct`) : console.log(`${ProblemList[i].name}: Incorrect`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })