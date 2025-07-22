// controller.js
import usermodel from "../models/usermodel.js";

export const sendsosmsg = async (req, res) => {
  try {
    const user = await usermodel.findById(req.user.id);

    if (!user || user.emergencycontacts.length === 0) {
      return res.status(404).json({ error: "No emergency contacts found!" });
    }

    const contacts = user.emergencycontacts.map(c => c.phone);
    const message = `🚨 Emergency Alert!\n${user.fullname} (📱 ${user.phoneno}) may be in danger.`;

    return res.status(200).json({
      success: true,
      contacts,
      message,
      fullname: user.fullname,
      phoneno: user.phoneno,
    });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
};
