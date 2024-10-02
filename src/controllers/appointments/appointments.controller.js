import { Appointments } from "../../models";

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointments.find({ user: req.userId });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointments.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.userId) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const createAppointment = async (req, res) => {
  const { date, doctor } = req.body;
  try {
    const newAppointment = new Appointments({
      user: req.userId,
      doctor: doctor,
      date,
    });

    const appointment = await newAppointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const updateAppointment = async (req, res) => {
  const { status } = req.body;
  try {
    let appointment = await Appointments.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.userId) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointments.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.userId) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await appointment.remove();
    res.json({ msg: "Appointment removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
