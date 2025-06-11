import { query } from "../config/database.js";

export async function createCampaign(req, res) {
    const {
        name,
        description,
        location,
        start_date,
        end_date,
        // status,   //Default:PREPARING-->UPCOMING-->ONGOING -->DONE or CANCELLED
        specialist_exam_ids
    } = req.body;

    const register_ids = [];

    if (!name || !description || !location || !start_date || !end_date || !Array.isArray(specialist_exam_ids)) {
        return res.status(400).json({ error: true, message: "Thiếu các thông tin cần thiết." });
    }


    try {
        // Buoc 1: Thêm mới một đợt checkup
        const result_campaign = await query(
            `INSERT INTO CheckupCampaign 
            (name, description, location, start_date, end_date, status) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [name, description, location, start_date, end_date, 'PREPARING']
        );

        const campaign = result_campaign.rows[0];

        // Buoc 2: Lấy từng id khám chuyên khoa gắn vào trong bảng
        for (const exam_id of specialist_exam_ids) {
            //Create CampainContain
            await query(
                `INSERT INTO CampaignContainSpeExam (campaign_id, specialist_exam_id)
         VALUES ($1, $2)`,
                [campaign.id, exam_id]
            );

        }

        // Buoc 3: Tạo register cho toàn trường
        const result_student = await query(`SELECT * FROM Student`);
        const students = result_student.rows;
        for (const student of students) {
            await query(
                `INSERT INTO CheckupRegister (campaign_id, student_id, status)
         VALUES ($1, $2, $3)`,
                [campaign.id, student.id, 'PENDING']
            );
        }

        //Lấy tất cả các id Register có Campaign ID mới vừa tạo
        const result_checkup_register =
            await query('SELECT * FROM checkupregister WHERE campaign_id = $1', [campaign.id]

            );
        for (const row of result_checkup_register.rows) {
            register_ids.push(row.id);
        }

        // Bước 4: Tạo specialistExamRecord cho từng register_id và specialist_id

        for (const registerId of register_ids) {
            for (const examId of specialist_exam_ids) {
                await query(
                    `INSERT INTO specialistExamRecord (register_id,  spe_exam_id,can_attach_file)
                    VALUES ($1, $2, $3)`,
                    [registerId, examId, false]
                );
            }
        }

        // Bước 5: Tạo HealthRecord cho các register trên   
        // const health_records = 

        // return res.status(200).json({ error: false, message: `Tạo thành công Đợt khám định kỳ: ${name}` });

    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res.status(500).json({ error: true, message: "Lỗi server khi tạo Check Up Campaign." });
    }

}

export async function getCheckupRegister(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: true, message: "Thiếu ID Parent." });
    }

    try {

        //Lấy tất cả Student có mon_id or dad_id là parent_id
        const result_student = await query(
            `SELECT * FROM Student WHERE mom_id = $1 OR dad_id = $2`,
            [id, id]
        );

        //Lấy student_id từ Prent
        const student_ids = [];
        for (const student of result_student.rows) {
            student_ids.push(student.id);
        }

        if (student_ids.length === 0) {
            return res.status(400).json({ error: true, message: "Không tìm thấy ID của Student." });
        }

        //Lấy các CheckUpRegister và speciallistexamrecord từ Student_id có status là PENDING

        const allRegisters = [];

        for (const student_id of student_ids) {
            const result_checkup_register = await query(
                ` SELECT 
        r.id AS register_id,
        r.campaign_id,
        r.student_id,
        r.submit_by,
        r.submit_time,
        r.reason,
        r.status,
        s.spe_exam_id,
        s.can_attach_file
      FROM checkupregister r
      JOIN specialistexamrecord s ON s.register_id = r.id
      WHERE r.student_id = $1 AND r.status = $2
  `, [student_id, 'PENDING']
            );

            allRegisters.push(...result_checkup_register.rows);

        }

        if (allRegisters.length <= 0) {
            return res.status(200).json({ error: false, message: 'Không có CheckUp Register' })
        }

        // 3. Group by register_id
        const mapByRegister = {};
        for (const row of allRegisters) {
            const id = row.register_id;
            if (!mapByRegister[id]) {
                // Khởi tạo lần đầu
                mapByRegister[id] = {
                    register_id: row.register_id,
                    campaign_id: row.campaign_id,
                    student_id: row.student_id,
                    submit_by: row.submit_by,
                    submit_time: row.submit_time,
                    reason: row.reason,
                    status: row.status,
                    exams: []
                };
            }
            // Đẩy exam vào mảng
            mapByRegister[id].exams.push({
                spe_exam_id: row.spe_exam_id,
                can_attach_file: row.can_attach_file
            });
        }

        // Chuyển về array
        const mergedRegisters = Object.values(mapByRegister);

        // 4. Trả về
        return res.status(200).json({ error: false, data: mergedRegisters });




    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res.status(500).json({ error: true, message: "Lỗi server khi Parent nhận Register Form." });
    }
}


export async function submitRegister(req, res) {

    const { id } = req.params;
    const { registerId, submit_time, reason, status, exams } = req.body;



    try {

        if (!id || !registerId || !reason) {

            return res.status(400).json({ error: true, message: "Không có nội dung." });
        }

        if (!Array.isArray(exams)) {
            return res.status(400).json({ error: true, message: "Không có exams." });
        }

        const result_submit = await query(`UPDATE checkupregister
         SET
           reason      = $1,
           status      = $2,
           submit_by   = $3,
           submit_time = $4
       WHERE id = $5`,
            [reason, 'SUBMITTED', id, submit_time, registerId]
        );


        if (result_submit.rowCount === 0) {
            return res.status(400).json({ error: true, message: "Submit Register không thành công." });
        }

        const result_update_speciallis = [];

        for (const ex of exams) {
            const { spe_exam_id, can_attach_file } = ex;
            const result_update = await query(
                `UPDATE specialistexamrecord
            SET can_attach_file = $1
          WHERE register_id = $2
            AND spe_exam_id  = $3`,
                [can_attach_file, registerId, spe_exam_id]);

            result_update_speciallis.push(result_update.rows);
        }

        if (result_update_speciallis.length > 0) {
            return res.status(200).json({ error: false, message: 'Submit thành công' });
        }


    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res.status(500).json({ error: true, message: "Lỗi server khi Submit Register Form." });
    }

}
export async function closeRegister(req, res) {

    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: true, message: "Thiếu ID." });
    }

    try {

        const result_check = await query('SELECT * FROM CheckupCampaign WHERE id = $1',
            [id]
        );
        if (result_check.rowCount === 0) {
            return res.status(400).json({ error: true, message: "Không tìm thấy id Campaign ." });
        }



        const result = await query(
            'UPDATE CheckupCampaign SET status = $1 WHERE id = $2',
            ['UPCOMING', id]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({ error: true, message: "Đóng form Register không thành công ." });
        } else return res.status(200).json({ error: false, message: 'Đóng form Register thành công' });


    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res.status(500).json({ error: true, message: "Lỗi khi đóng Register." });
    }

}

export async function cancelRegister(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: true, message: "Thiếu ID." });
    }

    try {

        const result_check = await query('SELECT * FROM CheckupCampaign WHERE id = $1',
            [id]
        );
        if (result_check.rowCount === 0) {
            return res.status(400).json({ error: true, message: "Không tìm thấy id Campaign ." });
        }



        const result = await query(
            'UPDATE CheckupCampaign SET status = $1 WHERE id = $2',
            ['CANCELLED', id]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({ error: true, message: "Hủy form Register không thành công ." });
        } else return res.status(200).json({ error: false, message: 'Hủy form Register thành công' });


    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res.status(500).json({ error: true, message: "Lỗi khi đóng Register." });
    }


}

export async function recordCheckUp(req, res) {
    const {
        register_id,
        height,
        weight,
        blood_pressure,
        left_eye,
        right_eye,
        ear,
        nose,
        throat,
        teeth,
        gums,
        skin_condition,
        heart,
        lungs,
        spine,
        posture,
        final_diagnosis

    } = req.body

    if (!height || !weight || !blood_pressure || !left_eye || !right_eye || !ear || !nose) {
        return res.status(400).json({ error: true, message: "Các chỉ số cơ bản không thể trống." });
    }



    try {

        const result_checkup_register_id = await query('SELECT * FROM checkupregister WHERE id = $1 ', [register_id]);

        if (result_checkup_register_id.rowCount === 0) {
            return res.status(400).json({ error: true, message: "Không tìm thấy Register ID." });
        }

        const result_check_healthrecord_id = await query('SELECT * FROM healthrecord WHERE register_id = $1 ', [register_id]);

        if (result_check_healthrecord_id.rowCount > 0) {
            return res.status(400).json({ error: true, message: "Đã tồn tại Record ." });
        } else {
            const result = await query(
                `INSERT INTO HealthRecord (
      register_id,
      height,
      weight,
      blood_pressure,
      left_eye,
      right_eye,
      ear,
      nose,
      throat,
      teeth,
      gums,
      skin_condition,
      heart,
      lungs,
      spine,
      posture,
      final_diagnosis
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    )
    RETURNING *`,
                [
                    register_id,
                    height,
                    weight,
                    blood_pressure,
                    left_eye,
                    right_eye,
                    ear,
                    nose,
                    throat,
                    teeth,
                    gums,
                    skin_condition,
                    heart,
                    lungs,
                    spine,
                    posture,
                    final_diagnosis
                ]
            );

            if (result.rowCount === 0) {
                res.status(400).json({ error: true, message: 'Không thể tạo health record.' });
            } else {
                return res.status(200).json({ error: false, message: 'Tạo record thành công' });

            }

        }


    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res.status(500).json({ error: true, message: "Lỗi khi tạo record." });
    }



}





