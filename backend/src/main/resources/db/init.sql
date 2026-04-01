CREATE TABLE Address
    ( 
     Patient_PatientID INTEGER  NOT NULL , 
     City              VARCHAR (100)  NOT NULL , 
     Street            VARCHAR (100)  NOT NULL , 
     HouseNo           VARCHAR (10)  NOT NULL , 
     ApartmentNo       VARCHAR (10) 
    ) 
;

ALTER TABLE Address 
    ADD CONSTRAINT Address_PK PRIMARY KEY ( Patient_PatientID ) ;

CREATE TABLE Doctor 
    ( 
     LicenseNo    CHAR (7)  NOT NULL , 
     Staff_UserID INTEGER  NOT NULL 
    ) 
;

ALTER TABLE Doctor 
    ADD CONSTRAINT Doctor_PK PRIMARY KEY ( Staff_UserID ) ;

ALTER TABLE Doctor 
    ADD CONSTRAINT Doctor_LicenseNo_UN UNIQUE ( LicenseNo ) ;

CREATE TABLE ExamDict 
    ( 
     ExamCode VARCHAR (20)  NOT NULL , 
     ExamType CHAR (1)  NOT NULL , 
     ExamName VARCHAR (255)  NOT NULL 
    ) 
;

ALTER TABLE ExamDict 
    ADD 
    CHECK (ExamType IN ('L', 'P')) 
;

ALTER TABLE ExamDict 
    ADD CONSTRAINT ExamDict_PK PRIMARY KEY ( ExamCode ) ;

CREATE TABLE LabExam 
    ( 
     LabExamID               INTEGER  NOT NULL , 
     Visit_VisitID           INTEGER  NOT NULL , 
     ExamDict_ExamCode       VARCHAR (20)  NOT NULL , 
     DoctorNotes             TEXT , 
     OrderDate               TIMESTAMP  NOT NULL , 
     Result                  TEXT , 
     Execution_Cancel_Date   TIMESTAMP , 
     ManagerNotes            TEXT , 
     Approval_Rejection_Date TIMESTAMP , 
     Status                  VARCHAR (50) DEFAULT 'Ordered'  NOT NULL , 
     LabTechnician_UserID    INTEGER , 
     LabManager_UserID       INTEGER 
    ) 
;

ALTER TABLE LabExam 
    ADD 
    CHECK (Status IN ('Completed', 'Ordered', 'Rejected', 'Validated')) 
;

ALTER TABLE LabExam 
    ADD CONSTRAINT LabExam_PK PRIMARY KEY ( LabExamID ) ;

CREATE TABLE LabManager 
    ( 
     Staff_UserID INTEGER  NOT NULL 
    ) 
;

ALTER TABLE LabManager 
    ADD CONSTRAINT LabManager_PK PRIMARY KEY ( Staff_UserID ) ;

CREATE TABLE LabTechnician 
    ( 
     Staff_UserID INTEGER  NOT NULL 
    ) 
;

ALTER TABLE LabTechnician 
    ADD CONSTRAINT LabTechnician_PK PRIMARY KEY ( Staff_UserID ) ;

CREATE TABLE Patient 
    ( 
     PatientID        INTEGER  NOT NULL , 
     FirstName        VARCHAR (100)  NOT NULL , 
     LastName         VARCHAR (100)  NOT NULL , 
     SocialSecurityNo CHAR (11)  NOT NULL , 
     DateOfBirth      DATE  NOT NULL , 
     Email            VARCHAR (100) , 
     PhoneNumber      VARCHAR (15)  NOT NULL 
    ) 
;

ALTER TABLE Patient 
    ADD CONSTRAINT Patient_PK PRIMARY KEY ( PatientID ) ;

ALTER TABLE Patient 
    ADD CONSTRAINT Patient_SocialSecurityNo_UN UNIQUE ( SocialSecurityNo ) ;

CREATE TABLE PhysicalExam 
    ( 
     PhysicalExamID    INTEGER  NOT NULL , 
     Visit_VisitID     INTEGER  NOT NULL , 
     ExamDict_ExamCode VARCHAR (20)  NOT NULL , 
     Result            TEXT 
    ) 
;

ALTER TABLE PhysicalExam 
    ADD CONSTRAINT PhysicalExam_PK PRIMARY KEY ( PhysicalExamID ) ;

CREATE TABLE Receptionist 
    ( 
     Staff_UserID INTEGER  NOT NULL 
    ) 
;

ALTER TABLE Receptionist 
    ADD CONSTRAINT Receptionist_PK PRIMARY KEY ( Staff_UserID ) ;

CREATE TABLE Staff 
    ( 
     UserID    INTEGER  NOT NULL , 
     FirstName VARCHAR (100)  NOT NULL , 
     LastName  VARCHAR (100)  NOT NULL , 
     Login     VARCHAR (100)  NOT NULL , 
     Password  VARCHAR (100)  NOT NULL , 
     IsActive  CHAR (1) DEFAULT 'Y'  NOT NULL , 
     UserType  VARCHAR (50)  NOT NULL 
    ) 
;

ALTER TABLE Staff 
    ADD 
    CHECK (IsActive IN ('N', 'Y')) 
;

ALTER TABLE Staff 
    ADD 
    CHECK (UserType IN ('Administrator', 'Doctor', 'LabManager', 'LabTechnician', 'Receptionist')) 
;

ALTER TABLE Staff 
    ADD CONSTRAINT Staff_PK PRIMARY KEY ( UserID ) ;

ALTER TABLE Staff 
    ADD CONSTRAINT Staff_Login_UN UNIQUE ( Login ) ;

CREATE TABLE Visit 
    ( 
     VisitID                INTEGER  NOT NULL , 
     Patient_PatientID      INTEGER  NOT NULL , 
     Description            TEXT  NOT NULL , 
     Diagnosis              TEXT , 
     Status                 VARCHAR (50) DEFAULT 'Registered'  NOT NULL , 
     RegistrationDate       TIMESTAMP  NOT NULL , 
     Completion_Cancel_Date TIMESTAMP , 
     Doctor_UserID          INTEGER  NOT NULL , 
     Receptionist_UserID    INTEGER  NOT NULL , 
     AppointmentDate        TIMESTAMP  NOT NULL 
    ) 
;

ALTER TABLE Visit 
    ADD 
    CHECK (Status IN ('Cancelled', 'Finished', 'Registered')) 
;

ALTER TABLE Visit 
    ADD CONSTRAINT Visit_PK PRIMARY KEY ( VisitID ) ;

ALTER TABLE Address 
    ADD CONSTRAINT Address_Patient_FK FOREIGN KEY 
    ( 
     Patient_PatientID
    ) 
    REFERENCES Patient 
    ( 
     PatientID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE Doctor 
    ADD CONSTRAINT Doctor_Staff_FK FOREIGN KEY 
    ( 
     Staff_UserID
    ) 
    REFERENCES Staff 
    ( 
     UserID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE LabExam 
    ADD CONSTRAINT LabExam_ExamDict_FK FOREIGN KEY 
    ( 
     ExamDict_ExamCode
    ) 
    REFERENCES ExamDict 
    ( 
     ExamCode
    ) 
;

ALTER TABLE LabExam 
    ADD CONSTRAINT LabExam_LabManager_FK FOREIGN KEY 
    ( 
     LabManager_UserID
    ) 
    REFERENCES LabManager 
    ( 
     Staff_UserID
    ) 
;

ALTER TABLE LabExam 
    ADD CONSTRAINT LabExam_LabTechnician_FK FOREIGN KEY 
    ( 
     LabTechnician_UserID
    ) 
    REFERENCES LabTechnician 
    ( 
     Staff_UserID
    ) 
;

ALTER TABLE LabExam 
    ADD CONSTRAINT LabExam_Visit_FK FOREIGN KEY 
    ( 
     Visit_VisitID
    ) 
    REFERENCES Visit 
    ( 
     VisitID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE LabManager 
    ADD CONSTRAINT LabManager_Staff_FK FOREIGN KEY 
    ( 
     Staff_UserID
    ) 
    REFERENCES Staff 
    ( 
     UserID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE LabTechnician 
    ADD CONSTRAINT LabTechnician_Staff_FK FOREIGN KEY 
    ( 
     Staff_UserID
    ) 
    REFERENCES Staff 
    ( 
     UserID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE PhysicalExam 
    ADD CONSTRAINT PhysicalExam_ExamDict_FK FOREIGN KEY 
    ( 
     ExamDict_ExamCode
    ) 
    REFERENCES ExamDict 
    ( 
     ExamCode
    ) 
;

ALTER TABLE PhysicalExam 
    ADD CONSTRAINT PhysicalExam_Visit_FK FOREIGN KEY 
    ( 
     Visit_VisitID
    ) 
    REFERENCES Visit 
    ( 
     VisitID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE Receptionist 
    ADD CONSTRAINT Receptionist_Staff_FK FOREIGN KEY 
    ( 
     Staff_UserID
    ) 
    REFERENCES Staff 
    ( 
     UserID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE Visit 
    ADD CONSTRAINT Visit_Doctor_FK FOREIGN KEY 
    ( 
     Doctor_UserID
    ) 
    REFERENCES Doctor 
    ( 
     Staff_UserID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE Visit 
    ADD CONSTRAINT Visit_Patient_FK FOREIGN KEY 
    ( 
     Patient_PatientID
    ) 
    REFERENCES Patient 
    ( 
     PatientID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE Visit 
    ADD CONSTRAINT Visit_Receptionist_FK FOREIGN KEY 
    ( 
     Receptionist_UserID
    ) 
    REFERENCES Receptionist 
    ( 
     Staff_UserID
    ) 
    ON DELETE CASCADE 
;

-- --- INITIAL DICTIONARY DATA (ExamDict) ---

-- 4 Laboratory Exams (Type 'L')
INSERT INTO ExamDict (ExamCode, ExamType, ExamName) VALUES ('C55', 'L', 'Morphology (Full Blood Count)');
INSERT INTO ExamDict (ExamCode, ExamType, ExamName) VALUES ('L43', 'L', 'Glucose Level (Serum)');
INSERT INTO ExamDict (ExamCode, ExamType, ExamName) VALUES ('A01', 'L', 'Urinalysis (General)');
INSERT INTO ExamDict (ExamCode, ExamType, ExamName) VALUES ('O17', 'L', 'Lipid Profile (CHOL, LDL, HDL, TG)');

-- 4 Physical Exams (Type 'P')
INSERT INTO ExamDict (ExamCode, ExamType, ExamName) VALUES ('89.142', 'P', 'Holter EEG');
INSERT INTO ExamDict (ExamCode, ExamType, ExamName) VALUES ('89.383', 'P', 'Spirometry Test');
INSERT INTO ExamDict (ExamCode, ExamType, ExamName) VALUES ('81.92', 'P', 'Joint or Ligament Injection');
INSERT INTO ExamDict (ExamCode, ExamType, ExamName) VALUES ('95.1901', 'P', 'Visual Acuity Test');
