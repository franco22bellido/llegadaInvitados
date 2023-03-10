import { Router } from "express";
import { crearInvitado, eliminarInvitado, renderCrearInvitado, verificarInvitado, verificarinvitadoToken, verInvitacion, ver_invitados } from "../controllers/invitados_controller.js";
import { isLoggedIn } from "../lib/authSesion.js";
const router = Router();

router.get('/',[isLoggedIn], ver_invitados);
router.post('/verificarInvitado',[isLoggedIn], verificarInvitado);
router.get('/crearinvitado',[isLoggedIn], renderCrearInvitado);
router.post('/crearinvitado',[isLoggedIn], crearInvitado);
router.get('/verificarInvitado/:token',[isLoggedIn], verificarinvitadoToken);

router.post('/eliminarInvitado',[isLoggedIn], eliminarInvitado);

router.get('/verInvitacion',[isLoggedIn], verInvitacion);

export default router;