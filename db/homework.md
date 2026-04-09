### DDL 실습

**문제 1: 테이블 생성하기 (CREATE TABLE)**

- **중복 데이터:** `nickname`
- **어떻게 구성?** `crew_id`를 PK로 잡고 닉네임 빼기.
- **추출 방법:**SQL

```sql
SELECT DISTINCT crew_id, nickname FROM attendance;
```

- **crew 테이블 생성:**SQL

```sql
CREATE TABLE crew (
  crew_id INT NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  PRIMARY KEY (crew_id)
);
```

- **데이터 삽입:**SQL

```sql
INSERT INTO crew (crew_id, nickname)
SELECT DISTINCT crew_id, nickname FROM attendance;
```

**문제 2: 테이블 컬럼 삭제하기 (ALTER TABLE)**

- **불필요한 컬럼:** `nickname` (crew 테이블로 뺐으니까)
- **컬럼 삭제:**SQL

```sql
ALTER TABLE attendance DROP COLUMN nickname;
```

**문제 3: 외래키 설정하기**

- **문제 방지 (외래키 제약조건):**SQL

```sql
ALTER TABLE attendance
ADD CONSTRAINT fk_crew_id FOREIGN KEY (crew_id) REFERENCES crew(crew_id);
```

**문제 4: 유니크 키 설정**

- **닉네임 중복 방지:**SQL

```sql
ALTER TABLE crew
ADD CONSTRAINT unique_nickname UNIQUE (nickname);
```

---

### DML(CRUD) 실습

**문제 5: 크루 닉네임 검색하기 (LIKE)**

SQL

```sql
SELECT nickname FROM crew WHERE nickname LIKE '디%';
```

**문제 6: 출석 기록 확인하기 (SELECT + WHERE)**

- attendance 테이블에 nickname이 없으니 서브 쿼리 사용.

SQL

```sql
SELECT * FROM attendance 
WHERE attendance_date = '2025-03-06' 
  AND crew_id = (SELECT crew_id FROM crew WHERE nickname = '어셔');
```

**문제 7: 누락된 출석 기록 추가 (INSERT)**

SQL

```sql
INSERT INTO attendance (crew_id, attendance_date, start_time, end_time)
SELECT crew_id, '2025-03-06', '09:31', '18:01' 
FROM crew WHERE nickname = '어셔';
```

**문제 8: 잘못된 출석 기록 수정 (UPDATE)**

SQL

```sql
UPDATE attendance SET start_time = '10:00'
WHERE attendance_date = '2025-03-12' 
  AND crew_id = (SELECT crew_id FROM crew WHERE nickname = '주니');
```

**문제 9: 허위 출석 기록 삭제 (DELETE)**

SQL

```sql
DELETE FROM attendance 
WHERE attendance_date = '2025-03-12' 
  AND crew_id = (SELECT crew_id FROM crew WHERE nickname = '아론');
```

**문제 10: 출석 정보 조회하기 (JOIN)**

SQL

```sql
SELECT c.nickname, a.attendance_date, a.start_time, a.end_time 
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id;
```

**문제 11: nickname으로 쿼리 처리하기 (서브 쿼리)**

SQL

```sql
SELECT * FROM attendance 
WHERE crew_id = (SELECT crew_id FROM crew WHERE nickname = '검프');
```

**문제 12: 가장 늦게 하교한 크루 찾기**

SQL

```sql
SELECT c.nickname, a.end_time 
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id 
WHERE a.attendance_date = '2025-03-05' 
ORDER BY a.end_time DESC 
LIMIT 1;
```

---

### 집계 함수 실습

**문제 13: 크루별로 '기록된' 날짜 수 조회**

SQL

```sql
SELECT c.nickname, COUNT(a.attendance_date) AS count_days 
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id 
GROUP BY c.nickname;
```

**문제 14: 크루별로 등교 기록이 있는 날짜 수 조회**

- `COUNT(컬럼)`은 NULL을 세지 않음.

SQL

```sql
SELECT c.nickname, COUNT(a.start_time) AS count_start_days 
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id 
GROUP BY c.nickname;
```

**문제 15: 날짜별로 등교한 크루 수 조회**

SQL

```sql
SELECT attendance_date, COUNT(crew_id) AS count_crew 
FROM attendance 
WHERE start_time IS NOT NULL 
GROUP BY attendance_date;
```

**문제 16: 크루별 가장 빠른/늦은 등교 시각**

SQL

```sql
SELECT c.nickname, MIN(a.start_time) AS min_start, MAX(a.start_time) AS max_start 
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id 
GROUP BY c.nickname;
```

### **SQL 실습 관련**

**1. 기본키(Primary Key)란 무엇이고 왜 필요한가?**

- **개념:** 테이블에서 각 레코드(행)를 겹치지 않게 식별할 수 있는 유일한 고유값.
- **필요성:** '검프'라는 닉네임을 쓰는 사람이 2명일 때, 기본키가 없다면 누구의 출석 기록을 수정해야 할지 특정할 수 없음. 또한, 다른 테이블(출석)에서 특정 크루를 가리킬 때(외래키) 명확한 기준점이 됨.

**2. MySQL에서 AUTO_INCREMENT는 왜 필요한가?**

- **필요성:** 레코드가 추가될 때마다 개발자가 이전 ID 값을 조회하고 +1을 해서 넣는 것은 매우 비효율적. 특히 여러 명이 동시에 출석 버튼을 누를 때 겹치는 ID가 부여되는 동시성 문제를 방지해 주고, DB가 알아서 고유 번호를 발급해주니 안전함.

**3. NULL 값을 처리할 때 주의할 점은?**

- **DB 관점:** `NULL`은 0이나 공백('')이 아닌 '데이터 없음(Unknown)' 상태. 따라서 `=` 연산자로 비교할 수 없고 반드시 `IS NULL`을 써야 함. 또한 집계 함수(COUNT 등)를 쓸 때 `NULL` 값은 카운트에서 제외됨.
- **프론트/백엔드 관점:** 하교 기록이 `NULL`인데 화면에 `null`이나 `undefined`라는 텍스트가 그대로 노출되거나, 연산 중 NullPointerException 에러가 터질 수 있음. "하교 전" 또는 "-" 같은 기본값 처리가 필수적.

**4. ER 다이어그램 비유 (일대다 관계, 1:N)**

- **관계:** `crew` 테이블(1)이 `attendance` 테이블(N)을 가짐. 크루 한 명이 여러 번의 출석 기록을 남김.
- **실생활 비유:**
    - 고객(1)과 주문 내역(N)
    - 유튜브 채널(1)과 업로드된 영상들(N)
    - 은행 계좌(1)와 입출금 거래 내역(N)

---

**5. 100명이 동시에 등교 버튼을 누른다면? (트랜잭션과 ACID)**

- **상황:** 동시에 수많은 INSERT/UPDATE 요청이 DB로 쏟아짐.
- **Atomicity(원자성):** 출석 처리는 '완벽한 성공' 아니면 '전체 취소(Rollback)'여야 함. 시스템 오류로 시간만 기록되고 상태는 안 들어가는 식의 반쪽짜리 저장을 막아줌.
- **Isolation(격리성):** 100명이 동시에 접근하더라도, 각각의 요청은 독립적으로 처리됨. 서로의 출석 데이터에 락(Lock)을 걸어 간섭하지 못하게 만들어 데이터가 꼬이는(예: 같은 AUTO_INCREMENT 번호를 부여받는) 현상을 방지함.

**6. 출석 데이터를 파일(CSV)이 아닌 DB에 저장하는 이유**

- **동시성 문제:** 100명이 동시에 엑셀 파일(CSV)에 글을 쓰려고 하면 파일이 잠기거나 데이터가 깨짐.
- **무결성 부족:** 시간 컬럼에 '18:00' 대신 '집에갈래'라고 적어도 파일은 막지 못함. DB는 데이터 타입과 제약 조건으로 이를 차단함.
- **조회 성능:** 특정 날짜의 데이터만 찾고 싶어도 파일은 처음부터 끝까지 다 읽어야 하지만, DB는 인덱스를 통해 바로 찾아냄.

**7. NoSQL(MongoDB)로 저장한다면?**

- **구조의 변화:** 테이블 조인 대신, 크루 정보 안에 출석 데이터를 배열(Array) 형태로 내장(Embedding)하거나 JSON 형식으로 유연하게 저장.

```json
{
  "crew_id": 1,
  "nickname": "검프",
  "attendances": [
    {"date": "2025-03-04", "start": "09:45", "end": "18:10"}
  ]
}
```

- **장점 (유연성):** 오늘 눈이 와서 '날씨'나 '지각 사유' 같은 항목을 갑자기 추가해야 할 때, 테이블 구조 변경(ALTER) 없이 해당 도큐먼트에만 그냥 찔러넣으면 됨.
- **단점 (데이터 중복과 통계):** 만약 크루 데이터를 내장하지 않고 따로 관리한다면 데이터 중복이 발생할 수 있음. "3월 전체 크루의 평균 출석률" 같은 복잡한 관계형 통계를 뽑아낼 때는 RDBMS의 SQL보다 쿼리 작성이 까다로울 수 있음.
