CREATE TABLE Parent (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
);

INSERT INTO parent (id, name, email)
VALUES
  ('81705d11-3052-4d70-82f2-1c11e8077dbe', 'Nguyễn Văn Tèo', 'mndkhanh.alt@gmail.com'),
  ('00f7f4c0-4998-4593-b9c4-6b8d74596cd9', 'Nguyễn Văn Bê', 'mndkhanh.alt3@gmail.com'),
  ('3dfa7d35-7f0f-449f-afbf-bb6e420016d2', 'Hoàng Tấn Đạt', 'dathtse196321@gmail.com'),
  ('be258789-4fe3-421c-baed-53ef3ed87f3b', 'Phạm Thành Phúc', 'phamthanhqb2005@gmail.com')
  ;


CREATE TABLE grade (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO grade (name) VALUES
('khối 1'),
('khối 2'),
('khối 3'),
('khối 4'),
('khối 5');

CREATE TABLE class (
    id SERIAL PRIMARY KEY,
    grade_id INT REFERENCES grade(id),
    name VARCHAR(50) NOT NULL
);

-- Giả sử grade.id từ 1 đến 5 tương ứng với "khối 1" đến "khối 5"
INSERT INTO class (grade_id, name) VALUES
(1, 'lớp 1A'),
(1, 'lớp 1B'),
(2, 'lớp 2A'),
(2, 'lớp 2B'),
(3, 'lớp 3A'),
(3, 'lớp 3B'),
(4, 'lớp 4A'),
(4, 'lớp 4B'),
(5, 'lớp 5A'),
(5, 'lớp 5B');

CREATE TYPE gender_enum AS ENUM ('Nam', 'Nữ');
CREATE TABLE Student (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age INT CHECK (age > 0),
      dob DATE,
      gender gender_enum not null,
      class_id INT REFERENCES class(id),
      mom_id UUID REFERENCES parent(id),
      dad_id UUID REFERENCES parent(id)
);

INSERT INTO student (id, name, email, age, dob, gender, class_id, mom_id, dad_id)
VALUES
  ('550934ca-e6ee-456f-b40c-d7fdc173342b', 'Con Phúc', 'toannangcao3000@gmail.com', 12, '2013-09-05', 'Nam', 1, 'be258789-4fe3-421c-baed-53ef3ed87f3b', null),
  ('fc57f7ed-950e-46fb-baa5-7914798e9ae3', 'Con Đạt', 'dinhviethieu2910@gmail.com', 10, '2013-05-10', 'Nữ', 2, null, '3dfa7d35-7f0f-449f-afbf-bb6e420016d2'),
  ('1519af26-f341-471b-8471-ab33a061b657', 'Con Tèo', 'thuandntse150361@fpt.edu.vn', 9, '2013-03-11', 'Nữ', 2, null, '81705d11-3052-4d70-82f2-1c11e8077dbe'),
  ('ab9f1dc3-8b35-4b0c-9327-f677c3247143', 'Con Bê', 'coccamco.fpthcm@gmail.com',11, '2013-05-22', 'Nữ', 2, '00f7f4c0-4998-4593-b9c4-6b8d74596cd9', '81705d11-3052-4d70-82f2-1c11e8077dbe')
  ;

-------------------------FLOW SEND MEDICATION REQUEST 
CREATE TYPE senddrugrequest_status AS ENUM (
    'PROCESSING',
    'ACCEPTED',
    'RECEIVED',
    'DONE',
    'CANCELLED',
    'REFUSED'
);

CREATE TABLE SendDrugRequest (
    id SERIAL PRIMARY KEY,
	student_id UUID references student(id), 
	create_by UUID references parent(id),
    diagnosis TEXT NOT NULL,
    schedule_send_date DATE,
    receive_date DATE,
    intake_date DATE,
    note TEXT,
    prescription_file_url VARCHAR(255),
    status senddrugrequest_status NOT NULL
);

INSERT INTO SendDrugRequest (
    student_id, create_by, diagnosis, schedule_send_date, receive_date, intake_date,
    note, prescription_file_url, status
) VALUES 
(
    '550934ca-e6ee-456f-b40c-d7fdc173342b', -- student_id
    'be258789-4fe3-421c-baed-53ef3ed87f3b', -- create_by
    'Viêm dạ dày cấp',                      -- diagnosis
    '2025-06-10',                           -- schedule_send_date
    NULL,                                   -- receive_date
    NULL,                                   -- intake_date
    'Cần gửi thuốc sớm',                    -- note
    'https://luatduonggia.vn/wp-content/uploads/2025/06/quy-dinh-ve-noi-dung-ke-don-thuoc1.jpg', -- prescription_file_url
    'PROCESSING'                            -- status
),
(
    '1519af26-f341-471b-8471-ab33a061b657',
    '81705d11-3052-4d70-82f2-1c11e8077dbe',
    'TVCĐ',
    '2025-06-09',
    '2025-06-10',
    '2025-06-11',
    'Nhà trường giúp cháu uống thuốc đúng giờ',
    'https://cdn.lawnet.vn//uploads/NewsThumbnail/2019/02/26/0852441417662920-thuc-pham-chuc-nang.jpg',
    'DONE'
),
(
    'fc57f7ed-950e-46fb-baa5-7914798e9ae3',
    '3dfa7d35-7f0f-449f-afbf-bb6e420016d2',
    'Nhiễm trùng hô hấp trên cấp/ăn kém',
    '2025-06-08',
    NULL,
    NULL,
    'Gia đình muốn gửi thêm thuốc',
    'https://static.tuoitre.vn/tto/i/s626/2011/04/12/2FiN0VCC.jpg',
    'CANCELLED'
);

CREATE TABLE RequestItem (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES SendDrugRequest(id),
    name VARCHAR(255),
    intake_template_time VARCHAR(255)[] NOT NULL,
    dosage_usage TEXT NOT NULL
);

INSERT INTO RequestItem (request_id, name, intake_template_time, dosage_usage) VALUES
(1, 'Amoxycilin 500mg (Upanmox)', ARRAY['Trước khi ăn sáng', 'Trước khi ăn tối'], 'mỗi lần 2 viên'),
(1, 'Metrodinazol 250mg/v', ARRAY['Trước khi ăn sáng', 'Trước khi ăn tối'], 'mỗi lần 2 viên'),
(2, 'Seotalac', ARRAY['Sau ăn trưa', 'Sau ăn tối'], 'mỗi lần 1 viên'),
(2, 'Độc hoạt TKS viên (Lọ/100v)', ARRAY['Sau ăn sáng', 'Sau ăn trưa', 'Sau ăn tối'], 'mỗi lần 3 viên'),
(2, 'Đại tần giao', ARRAY['Sau ăn sáng', 'Sau ăn trưa', 'Sau ăn tối'], 'mỗi lần 3 viên'),
(3, 'Bimoclar', ARRAY['Sau ăn sáng', 'Sau ăn trưa'], 'uống mỗi lần 8ml'),
(3, 'Rinofil', ARRAY['Sau ăn trưa'], 'uống mỗi lần 5ml');

