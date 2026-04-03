-- ============================================================
-- CLINIC MANAGEMENT SYSTEM - POSTGRESQL DDL
-- ============================================================
CREATE TABLE address
    ( 
     patient_patient_id BIGINT  NOT NULL ,
     city              VARCHAR (100)  NOT NULL ,
     street            VARCHAR (100)  NOT NULL ,
     house_no           VARCHAR (10)  NOT NULL ,
     apartment_no       VARCHAR (10)
    ) 
;

ALTER TABLE address
    ADD CONSTRAINT address_pk PRIMARY KEY ( patient_patient_id ) ;

CREATE TABLE doctor 
    ( 
     license_no    VARCHAR (7)  NOT NULL , 
     staff_user_id BIGINT  NOT NULL 
    ) 
;

ALTER TABLE doctor 
    ADD CONSTRAINT doctor_pk PRIMARY KEY ( staff_user_id ) ;

ALTER TABLE doctor 
    ADD CONSTRAINT doctor_license_no_un UNIQUE ( license_no ) ;

CREATE TABLE exam_dict 
    ( 
     exam_code VARCHAR (20)  NOT NULL , 
     exam_type VARCHAR (1)  NOT NULL , 
     exam_name VARCHAR (255)  NOT NULL 
    ) 
;

ALTER TABLE exam_dict 
    ADD 
    CHECK (exam_type IN ('L', 'P')) 
;

ALTER TABLE exam_dict 
    ADD CONSTRAINT exam_dict_PK PRIMARY KEY ( exam_code ) ;

CREATE TABLE lab_exam 
    ( 
     lab_exam_id               BIGINT  NOT NULL , 
     visit_visit_id           BIGINT  NOT NULL , 
     exam_dict_exam_code       VARCHAR (20)  NOT NULL , 
     doctor_notes             TEXT , 
     order_date               TIMESTAMP  NOT NULL , 
     result                  TEXT , 
     execution_cancel_date   TIMESTAMP , 
     manager_notes            TEXT , 
     approval_rejection_date TIMESTAMP , 
     status                  VARCHAR (50) DEFAULT 'Ordered'  NOT NULL , 
     lab_technician_user_id    BIGINT , 
     lab_manager_user_id       BIGINT 
    ) 
;

ALTER TABLE lab_exam 
    ADD 
    CHECK (status IN ('Completed', 'Ordered', 'Rejected', 'Validated')) 
;

ALTER TABLE lab_exam 
    ADD CONSTRAINT lab_exam_pk PRIMARY KEY ( lab_exam_id ) ;

CREATE TABLE lab_manager 
    ( 
     staff_user_id BIGINT  NOT NULL 
    ) 
;

ALTER TABLE lab_manager 
    ADD CONSTRAINT lab_manager_pk PRIMARY KEY ( staff_user_id ) ;

CREATE TABLE lab_technician 
    ( 
     staff_user_id BIGINT  NOT NULL 
    ) 
;

ALTER TABLE lab_technician 
    ADD CONSTRAINT lab_technician_pk PRIMARY KEY ( staff_user_id ) ;

CREATE TABLE patient 
    ( 
     patient_id        BIGINT  NOT NULL , 
     first_name        VARCHAR (100)  NOT NULL , 
     last_name         VARCHAR (100)  NOT NULL , 
     social_security_no VARCHAR (11)  NOT NULL , 
     date_of_birth      DATE  NOT NULL , 
     email            VARCHAR (100) , 
     phone_number      VARCHAR (15)  NOT NULL 
    ) 
;

ALTER TABLE patient 
    ADD CONSTRAINT patient_pk PRIMARY KEY ( patient_id ) ;

ALTER TABLE patient 
    ADD CONSTRAINT patient_social_security_no_un UNIQUE ( social_security_no ) ;

CREATE TABLE physical_exam 
    ( 
     physical_exam_id    BIGINT  NOT NULL , 
     visit_visit_id     BIGINT  NOT NULL , 
     exam_dict_exam_code VARCHAR (20)  NOT NULL , 
     result            TEXT 
    ) 
;

ALTER TABLE physical_exam 
    ADD CONSTRAINT physical_exam_pk PRIMARY KEY ( physical_exam_id ) ;

CREATE TABLE receptionist 
    ( 
     staff_user_id BIGINT  NOT NULL 
    ) 
;

ALTER TABLE receptionist 
    ADD CONSTRAINT receptionist_pk PRIMARY KEY ( staff_user_id ) ;

CREATE TABLE staff 
    ( 
     user_id    BIGINT  NOT NULL , 
     first_name VARCHAR (100)  NOT NULL , 
     last_name  VARCHAR (100)  NOT NULL , 
     login     VARCHAR (100)  NOT NULL , 
     password  VARCHAR (100)  NOT NULL , 
     is_active  VARCHAR (1) DEFAULT 'Y'  NOT NULL , 
     user_type  VARCHAR (50)  NOT NULL 
    ) 
;

ALTER TABLE staff 
    ADD 
    CHECK (is_active IN ('N', 'Y')) 
;

ALTER TABLE staff 
    ADD 
    CHECK (user_type IN ('Administrator', 'Doctor', 'LabManager', 'LabTechnician', 'Receptionist'))
;

ALTER TABLE staff 
    ADD CONSTRAINT staff_pk PRIMARY KEY ( user_id ) ;

ALTER TABLE staff 
    ADD CONSTRAINT staff_login_un UNIQUE ( login ) ;

CREATE TABLE visit 
    ( 
     visit_id                BIGINT  NOT NULL , 
     patient_patient_id      BIGINT  NOT NULL , 
     description            TEXT  NOT NULL , 
     diagnosis              TEXT , 
     status                 VARCHAR (50) DEFAULT 'Registered'  NOT NULL , 
     registration_date       TIMESTAMP  NOT NULL , 
     completion_cancel_date TIMESTAMP , 
     doctor_user_id          BIGINT  NOT NULL , 
     receptionist_user_id    BIGINT  NOT NULL , 
     appointment_date        TIMESTAMP  NOT NULL 
    ) 
;

ALTER TABLE visit 
    ADD 
    CHECK (status IN ('Cancelled', 'Finished', 'Registered')) 
;

ALTER TABLE visit 
    ADD CONSTRAINT visit_pk PRIMARY KEY ( visit_id ) ;

ALTER TABLE address 
    ADD CONSTRAINT address_patient_fk FOREIGN KEY 
    ( 
     patient_patient_id
    ) 
    REFERENCES patient 
    ( 
     patient_id
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE doctor 
    ADD CONSTRAINT doctor_staff_fk FOREIGN KEY 
    ( 
     staff_user_id
    ) 
    REFERENCES staff 
    ( 
     user_id
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE lab_exam 
    ADD CONSTRAINT lab_exam_exam_dict_fk FOREIGN KEY 
    ( 
     exam_dict_exam_code
    ) 
    REFERENCES exam_dict 
    ( 
     exam_code
    ) 
;

ALTER TABLE lab_exam 
    ADD CONSTRAINT lab_exam_lab_manager_fk FOREIGN KEY 
    ( 
     lab_manager_user_id
    ) 
    REFERENCES lab_manager 
    ( 
     staff_user_id
    ) 
;

ALTER TABLE lab_exam 
    ADD CONSTRAINT lab_exam_lab_technician_fk FOREIGN KEY 
    ( 
     lab_technician_user_id
    ) 
    REFERENCES lab_technician 
    ( 
     staff_user_id
    ) 
;

ALTER TABLE lab_exam 
    ADD CONSTRAINT lab_exam_visit_fk FOREIGN KEY 
    ( 
     visit_visit_id
    ) 
    REFERENCES visit 
    ( 
     visit_id
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE lab_manager 
    ADD CONSTRAINT lab_manager_staff_fk FOREIGN KEY 
    ( 
     staff_user_id
    ) 
    REFERENCES staff 
    ( 
     user_id
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE lab_technician 
    ADD CONSTRAINT lab_technician_staff_fk FOREIGN KEY 
    ( 
     staff_user_id
    ) 
    REFERENCES staff 
    ( 
     user_id
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE physical_exam 
    ADD CONSTRAINT physical_exam_exam_dict_fk FOREIGN KEY 
    ( 
     exam_dict_exam_code
    ) 
    REFERENCES exam_dict 
    ( 
     exam_code
    ) 
;

ALTER TABLE physical_exam 
    ADD CONSTRAINT physical_exam_visit_fk FOREIGN KEY 
    ( 
     visit_visit_id
    ) 
    REFERENCES visit 
    ( 
     visit_id
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE receptionist 
    ADD CONSTRAINT receptionist_staff_fk FOREIGN KEY 
    ( 
     staff_user_id
    ) 
    REFERENCES staff 
    ( 
     user_id
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE visit 
    ADD CONSTRAINT visit_doctor_fk FOREIGN KEY 
    ( 
     doctor_user_id
    ) 
    REFERENCES doctor 
    ( 
     staff_user_id
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE visit 
    ADD CONSTRAINT visit_patient_fk FOREIGN KEY 
    ( 
     patient_patient_id
    ) 
    REFERENCES patient 
    ( 
     patient_id
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE visit 
    ADD CONSTRAINT visit_receptionist_fk FOREIGN KEY 
    ( 
     receptionist_user_id
    ) 
    REFERENCES receptionist 
    ( 
     staff_user_id
    ) 
    ON DELETE CASCADE 
;

-- --- INITIAL DICTIONARY DATA (exam_dict) ---

-- Laboratory Exams (Type 'L')
INSERT INTO exam_dict (exam_code, exam_type, exam_name) VALUES ('C55', 'L', 'Morphology (Full Blood Count)');
INSERT INTO exam_dict (exam_code, exam_type, exam_name) VALUES ('L43', 'L', 'Glucose Level (Serum)');
INSERT INTO exam_dict (exam_code, exam_type, exam_name) VALUES ('A01', 'L', 'Urinalysis (General)');
INSERT INTO exam_dict (exam_code, exam_type, exam_name) VALUES ('O17', 'L', 'Lipid Profile (CHOL, LDL, HDL, TG)');

-- Physical Exams (Type 'P')
INSERT INTO exam_dict (exam_code, exam_type, exam_name) VALUES ('89.142', 'P', 'Holter EEG');
INSERT INTO exam_dict (exam_code, exam_type, exam_name) VALUES ('89.383', 'P', 'Spirometry Test');
INSERT INTO exam_dict (exam_code, exam_type, exam_name) VALUES ('81.92', 'P', 'Joint or Ligament Injection');
INSERT INTO exam_dict (exam_code, exam_type, exam_name) VALUES ('95.1901', 'P', 'Visual Acuity Test');
