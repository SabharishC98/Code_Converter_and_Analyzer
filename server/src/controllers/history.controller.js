import * as svc from "../services/history.service.js";

export const getHistory      = async (req, res, next) => { try { res.json({ success: true, data: await svc.getUserHistory(req.user._id, +req.query.page||1, +req.query.limit||10) }); } catch(e){next(e);} };
export const getHistoryItem  = async (req, res, next) => { try { const e = await svc.getHistoryById(req.params.id, req.user._id); res.json({ success: true, data: e }); } catch(e){next(e);} };
export const deleteHistoryItem=async (req, res, next) => { try { await svc.deleteHistoryById(req.params.id, req.user._id); res.json({ success: true }); } catch(e){next(e);} };
export const clearHistory    = async (req, res, next) => { try { await svc.clearUserHistory(req.user._id); res.json({ success: true }); } catch(e){next(e);} };