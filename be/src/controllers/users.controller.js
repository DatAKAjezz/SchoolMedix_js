import { supabaseAdmin } from "../config/supabase.js";
import { query } from "../config/database.js";
import { sendWelcomeEmail } from "../services/email/index.js"; // make sure this exports correctly

export async function createParent(req, res) {
      const { email, name } = req.body;

      if (!email || !name) {
            return res.status(400).json({ error: "Missing email or name" });
      }

      const password = generateRandomPassword();
      const role = "parent";

      // Step 1: Create user in Supabase
      const { data, error } = await supabaseAdmin.createUser({
            email,
            password,
            app_metadata: { role },
            user_metadata: { name },
            email_confirm: true
      });

      if (error) {
            console.error("❌ Error creating parent:", error.message);
            return res.status(400).json({ error: error.message });
      }

      console.log("✅ Created parent:", data.user);
      const id = data.user.id;

      // Step 2: Save user to Postgres
      try {
            const result = await query(
                  "INSERT INTO parent (id, name, email) VALUES ($1, $2, $3) RETURNING *",
                  [id, name, email]
            );
            res.status(201).json(result.rows[0]);
      } catch (err) {
            console.error("❌ Database insert error:", err);
            return res.status(500).json({ error: "Database error" });
      }

      // Step 3: Send welcome email
      try {
            await sendWelcomeEmail(email, name, role, password);
      } catch (err) {
            console.warn("⚠️ Email sending failed:", err.message);
      }
}

export async function createStudent(req, res) {
      const { email, name, age, dob, gender, class_id, mom_id, dad_id } = req.body;

      // Kiểm tra dữ liệu cơ bản
      if (!email || !name || !age || !dob || !gender || !class_id) {
            return res.status(400).json({ error: "Missing required fields" });
      }

      if (mom_id && dad_id && mom_id === dad_id) {
            return res.status(400).json({ error: "Mom and Dad IDs must be different" });
      }

      const password = generateRandomPassword();
      const role = "student";

      // Step 1: Create user in Supabase
      const { data, error } = await supabaseAdmin.createUser({
            email,
            password,
            app_metadata: { role },
            user_metadata: { name },
            email_confirm: true
      });

      if (error) {
            console.error("❌ Error creating student in Supabase:", error.message);
            return res.status(400).json({ error: error.message });
      }

      const id = data.user.id;
      console.log("✅ Created student in Supabase:", id);
      return;
      // Step 2: Insert into database
      try {
            const result = await query(
                  `INSERT INTO student (id, name, email, age, dob, gender, class_id, mom_id, dad_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                  [id, name, email, age, dob, gender, class_id, mom_id || null, dad_id || null]
            );
            res.status(201).json(result.rows[0]);
      } catch (err) {
            console.error("❌ Database insert error:", err);
            return res.status(500).json({ error: "Database error" });
      }

      // Step 3: Send welcome email
      try {
            await sendWelcomeEmail(email, name, role, password);
      } catch (err) {
            console.warn("⚠️ Email sending failed:", err.message);
      }
}

export async function createAdmin(req, res) {
      const { email, name } = req.body;

      // Kiểm tra dữ liệu cơ bản
      if (!email || !name) {
            return res.status(400).json({ error: "Missing email or name" });
      }

      const password = generateRandomPassword();
      const role = "admin";

      // Step 1: Create user in Supabase
      const { data, error } = await supabaseAdmin.createUser({
            email,
            password,
            app_metadata: { role },
            user_metadata: { name },
            email_confirm: true
      });

      if (error) {
            console.error("❌ Error creating admin in Supabase:", error.message);
            return res.status(400).json({ error: error.message });
      }

      const id = data.user.id;
      console.log("✅ Created admin in Supabase:", id);

      // Step 2: Send welcome email
      try {
            await sendWelcomeEmail(email, name, role, password);
      } catch (err) {
            console.warn("⚠️ Email sending failed:", err.message);
      }
}


export async function createNurse(req, res) {
      const { email, name } = req.body;

      // Kiểm tra dữ liệu cơ bản
      if (!email || !name) {
            return res.status(400).json({ error: "Missing email or name" });
      }

      const password = generateRandomPassword();
      const role = "nurse";

      // Step 1: Create user in Supabase
      const { data, error } = await supabaseAdmin.createUser({
            email,
            password,
            app_metadata: { role },
            user_metadata: { name },
            email_confirm: true
      });

      if (error) {
            console.error("❌ Error creating nurse in Supabase:", error.message);
            return res.status(400).json({ error: error.message });
      }

      const id = data.user.id;
      console.log("✅ Created nurse in Supabase:", id);

      // Step 2: Send welcome email
      try {
            await sendWelcomeEmail(email, name, role, password);
      } catch (err) {
            console.warn("⚠️ Email sending failed:", err.message);
      }
}

export async function deleteParentByID() {

}

export async function deleteParentByEmail() {

}

function generateRandomPassword() {
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      const special = '!#$%^*()_+@-=';

      const allChars = uppercase + lowercase + numbers + special;

      // Đảm bảo có ít nhất một ký tự mỗi loại
      const getRandom = (chars) => chars[Math.floor(Math.random() * chars.length)];

      let password = [
            getRandom(uppercase),
            getRandom(lowercase),
            getRandom(numbers),
            getRandom(special),
      ];

      // Thêm 4 ký tự ngẫu nhiên từ tất cả các nhóm
      for (let i = 0; i < 4; i++) {
            password.push(getRandom(allChars));
      }

      // Trộn ngẫu nhiên
      return password.sort(() => Math.random() - 0.5).join('');
}







