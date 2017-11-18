#### Module Node-Red pour S.A.R.A.H V5

### Inputs

- `msg.payload.options.plugin`:

à utiliser avec un module **switch** pour rediriger vers le bon plugin

valeur de `out.action.plugin` du fichier **sarah-domoticz.xml**

- `msg.payload.options.action`:

**On** / **Off** / **temp** / **humidity**

valeur de `out.action.action` du fichier **sarah-domoticz.xml**

- `msg.payload.options.command`:

**switch** / **status**

valeur de `out.action.command` du fichier **sarah-domoticz.xml**

- `msg.payload.options.device`:

**id** du device dans domoticz

valeur de `out.action.device` du fichier **sarah-domoticz.xml**

- `msg.payload.options.type`:

**light** / **scene**

valeur de `out.action.type` du fichier **sarah-domoticz.xml**

### Outputs

- `msg.payload`: renvoyé par win-sarah

- `msg.speak`: texte à lire par win-speak(ou autre)

### Détails

module à associer aux modules SARAH

- **win-sarah**

- **win-speak**

Copier le fichier xml **./grammar/sarah-domoticz.xml** dans le dossier grammar configuré sur le module **win-sarah**

modifier le fichier **sarah-domoticz.xml** pour qu'il corresponde à vos equipements sur domoticz

dans le cas de plusieur plugin utiliser un module **switch** avec comme discriminant `msg.payload.options.plugin` renvoyé par **win-sarah** (ici **domticz-http**)

### Utilisation:

sarah allumes/eteins le salon

sarah mets rmc

sarah quelle est la température/humidité du salon

sarah comment est le salon
