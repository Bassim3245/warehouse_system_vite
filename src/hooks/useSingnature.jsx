import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSignatureBydocumentId } from "../redux/signatureStlice/signatureAction";

export default function useSingnature({ documentId, refresh }) {
  const { signauterData } = useSelector((state) => state.signauter);
  const dispatch = useDispatch();
  const getSignature = useCallback(async () => {
    dispatch(getSignatureBydocumentId(documentId));
  }, [documentId]);
  useEffect(() => {
    getSignature();
  }, [getSignature, refresh]);
  return {
    signauterData,
  };
}
