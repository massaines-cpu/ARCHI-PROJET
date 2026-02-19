import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { UserPlus, MapPin, Search, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { addCase } from "../api/api";

const AddCaseForm = ({ infections = [], onCaseAdded }) => {
  const [addressInput, setAddressInput] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoResult, setGeoResult] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const geocode = async () => {
    if (!addressInput.trim()) return;
    setGeoLoading(true);
    setGeoError(null);
    setGeoResult(null);
    try {
      const { data } = await axios.get(
        `/nominatim/search?q=${encodeURIComponent(addressInput)}&format=json&limit=1&countrycodes=fr`
      );
      if (!data.length) {
        setGeoError("Adresse introuvable.");
        return;
      }
      const { lat, lon, display_name } = data[0];
      const label = display_name.split(", ").slice(0, 3).join(", ");
      setGeoResult({ lat: parseFloat(lat), lng: parseFloat(lon), label });
    } catch {
      setGeoError("Erreur lors de la géolocalisation.");
    } finally {
      setGeoLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!geoResult) {
      setGeoError("Veuillez localiser l'adresse.");
      return;
    }
    setSubmitStatus("loading");
    try {
      await addCase({
        name: data.name,
        id_infection: Number(data.id_infection),
        contamination_date: data.contamination_date,
        frequented_places: [[geoResult.lng, geoResult.lat]],
      });
      setSubmitStatus("success");
      reset();
      setAddressInput("");
      setGeoResult(null);
      onCaseAdded?.();
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const handleReset = () => {
    reset();
    setAddressInput("");
    setGeoResult(null);
    setGeoError(null);
    setSubmitStatus(null);
  };

  return (
    <MainContainer>
      <TitleDiv>
        <UserPlus size={16} strokeWidth={2} />
        <TitleTexte>Déclarer un nouveau cas</TitleTexte>
      </TitleDiv>

      <LigneSeparation />

      <MonFormulaire onSubmit={handleSubmit(onSubmit)} noValidate>

        <InputGroup>
          <InputLabel>Nom du patient <RedStar>*</RedStar></InputLabel>
          <ChampTexte
            type="text"
            placeholder="ex. Jean Dupont"
            $error={!!errors.name}
            {...register("name", { required: "Le nom est requis." })}
          />
          {errors.name && <TexteErreur>{errors.name.message}</TexteErreur>}
        </InputGroup>

        <DeuxColonnes>
          <InputGroup>
            <InputLabel>Infection <RedStar>*</RedStar></InputLabel>
            <SelectDropdown
              $error={!!errors.id_infection}
              {...register("id_infection", { required: "Sélectionnez une infection." })}
            >
              <option value="">Sélectionner...</option>
              {infections.map((inf) => (
                <option key={inf.id} value={inf.id}>{inf.name}</option>
              ))}
            </SelectDropdown>
            {errors.id_infection && <TexteErreur>{errors.id_infection.message}</TexteErreur>}
          </InputGroup>

          <InputGroup>
            <InputLabel>Date de contamination <RedStar>*</RedStar></InputLabel>
            <ChampTexte
              type="date"
              $error={!!errors.contamination_date}
              {...register("contamination_date", { required: "La date est requise." })}
            />
            {errors.contamination_date && <TexteErreur>{errors.contamination_date.message}</TexteErreur>}
          </InputGroup>
        </DeuxColonnes>

        <InputGroup>
          <InputLabel>
            Lieu fréquenté <RedStar>*</RedStar>
          </InputLabel>
          <ZoneAdresse>
            <ChampAdresse
              type="text"
              placeholder="ex. 14 rue chez moi, Toulouse"
              value={addressInput}
              $error={!!geoError && !geoResult}
              onChange={(e) => {
                setAddressInput(e.target.value);
                setGeoResult(null);
                setGeoError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); geocode(); }
              }}
            />
            <BoutonLocaliser type="button" onClick={geocode} disabled={geoLoading || !addressInput.trim()}>
              Localiser
            </BoutonLocaliser>
          </ZoneAdresse>

          {geoResult && (
            <TexteVert>
              <span>{geoResult.label}</span>
            </TexteVert>
          )}
          {geoError && (
            <TexteErreur>{geoError}</TexteErreur>
          )}
        </InputGroup>

        <ZoneBoutons>
          <BtnAnnuler type="button" onClick={handleReset}>Réinitialiser</BtnAnnuler>
          <BtnEnvoyer type="submit" $status={submitStatus} disabled={submitStatus === "loading"}>
            {submitStatus === "loading" ? "Enregistrement..."
              : submitStatus === "success" ? "Cas ajouté !"
              : submitStatus === "error"   ? "Erreur — réessayer"
              : "Ajouter le cas"}
          </BtnEnvoyer>
        </ZoneBoutons>

      </MonFormulaire>
    </MainContainer>
  );
};

export default AddCaseForm;

const spinAnimation = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;
const apparitionAnimation = keyframes`from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); }`;

const MainContainer = styled.div`
  width: 50%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 28px 32px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
`;

const TitleDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  svg { color: #3b82f6; flex-shrink: 0; }
`;

const TitleTexte = styled.h2`
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const LigneSeparation = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
  margin: 18px 0;
`;

const MonFormulaire = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DeuxColonnes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InputLabel = styled.label`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.45);
`;

const RedStar = styled.span`
  color: #e74c3c;
  margin-left: 2px;
`;

const styleDeBase = ({ $error }) => `
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #e8e8f0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${$error ? "rgba(231, 76, 60, 0.6)" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 8px;
  padding: 10px 12px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s, background 0.15s;
  &::placeholder { color: rgba(255, 255, 255, 0.2); }
  &:focus {
    background: rgba(255, 255, 255, 0.07);
    border-color: ${$error ? "#e74c3c" : "rgba(59, 130, 246, 0.5)"};
  }
`;

const ChampTexte = styled.input`
  ${styleDeBase}
  &[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(0.6);
    cursor: pointer;
  }
`;

const SelectDropdown = styled.select`
  ${styleDeBase}
  cursor: pointer;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  padding-right: 32px;
  option { background: #0f0f1a; color: #e8e8f0; }
`;

const ZoneAdresse = styled.div`
  display: flex;
  gap: 8px;
`;

const ChampAdresse = styled.input`
  ${styleDeBase}
  flex: 1;
`;

const BoutonLocaliser = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #60a5fa;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;
  &:hover:not(:disabled) {
    background: rgba(59, 130, 246, 0.22);
    border-color: rgba(59, 130, 246, 0.55);
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const TexteVert = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #4ade80;
  animation: ${apparitionAnimation} 0.2s ease;
  svg { flex-shrink: 0; }
`;

const TexteErreur = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #e74c3c;
  animation: ${apparitionAnimation} 0.15s ease;
`;

const ZoneBoutons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
`;

const BtnAnnuler = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 18px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  &:hover {
    border-color: rgba(255, 255, 255, 0.22);
    color: rgba(255, 255, 255, 0.65);
  }
`;

const BtnEnvoyer = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 22px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #ffffff;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  background: ${({ $status }) =>
    $status === "success" ? "linear-gradient(135deg, #16a34a, #15803d)" :
    $status === "error"   ? "linear-gradient(135deg, #dc2626, #b91c1c)" :
                            "linear-gradient(135deg, #3b82f6, #7c3aed)"};
  &:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.35);
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  .spin { animation: ${spinAnimation} 0.8s linear infinite; }
`;
